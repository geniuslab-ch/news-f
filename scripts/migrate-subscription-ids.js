/**
 * Script de migration pour récupérer les stripe_subscription_id
 * depuis Stripe et les ajouter aux packages existants
 * 
 * Usage: node scripts/migrate-subscription-ids.js
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateSubscriptionIds() {
    console.log('🚀 Début de la migration des subscription IDs...\n');

    try {
        // 1. Récupérer tous les packages actifs sans stripe_subscription_id
        const { data: packages, error: fetchError } = await supabase
            .from('packages')
            .select('*')
            .eq('status', 'active')
            .is('stripe_subscription_id', null);

        if (fetchError) {
            console.error('❌ Erreur lors de la récupération des packages:', fetchError);
            return;
        }

        console.log(`📦 ${packages.length} packages à migrer\n`);

        if (packages.length === 0) {
            console.log('✅ Aucun package à migrer !');
            return;
        }

        let updated = 0;
        let failed = 0;

        // 2. Pour chaque package, récupérer la subscription depuis Stripe
        for (const pkg of packages) {
            console.log(`\nTraitement du package ${pkg.id} (user: ${pkg.user_id})...`);

            try {
                // Récupérer l'email de l'utilisateur
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('id', pkg.user_id)
                    .single();

                if (!profile?.email) {
                    console.log(`⚠️  Email non trouvé pour user ${pkg.user_id}`);
                    failed++;
                    continue;
                }

                console.log(`   Email: ${profile.email}`);

                // Chercher le customer Stripe
                const customers = await stripe.customers.list({
                    email: profile.email,
                    limit: 1
                });

                if (customers.data.length === 0) {
                    console.log(`   ⚠️  Aucun customer Stripe trouvé`);
                    failed++;
                    continue;
                }

                const customer = customers.data[0];
                console.log(`   Customer Stripe: ${customer.id}`);

                // Récupérer les subscriptions actives du customer
                const subscriptions = await stripe.subscriptions.list({
                    customer: customer.id,
                    status: 'active',
                    limit: 10
                });

                if (subscriptions.data.length === 0) {
                    console.log(`   ⚠️  Aucune subscription active trouvée`);
                    failed++;
                    continue;
                }

                // Prendre la première subscription active
                // (ou vous pouvez ajouter une logique pour matcher par date/montant)
                const subscription = subscriptions.data[0];
                console.log(`   Subscription trouvée: ${subscription.id}`);

                // Mettre à jour le package
                const { error: updateError } = await supabase
                    .from('packages')
                    .update({ stripe_subscription_id: subscription.id })
                    .eq('id', pkg.id);

                if (updateError) {
                    console.log(`   ❌ Erreur lors de la mise à jour:`, updateError);
                    failed++;
                } else {
                    console.log(`   ✅ Package mis à jour avec subscription ${subscription.id}`);
                    updated++;
                }

            } catch (error) {
                console.log(`   ❌ Erreur:`, error.message);
                failed++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`\n📊 Résultats de la migration:`);
        console.log(`   ✅ Mis à jour: ${updated}`);
        console.log(`   ❌ Échecs: ${failed}`);
        console.log(`   📦 Total: ${packages.length}\n`);

    } catch (error) {
        console.error('❌ Erreur fatale:', error);
    }
}

// Exécuter la migration
if (require.main === module) {
    migrateSubscriptionIds()
        .then(() => {
            console.log('🎉 Migration terminée !');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Erreur:', error);
            process.exit(1);
        });
}

module.exports = { migrateSubscriptionIds };
