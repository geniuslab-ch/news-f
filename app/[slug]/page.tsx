import { notFound } from 'next/navigation';
import { programs } from '@/lib/programsConfig';
import ProgramPageClient from './ProgramPageClient';

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const program = programs[resolvedParams.slug];

    if (!program) {
        notFound();
    }

    return <ProgramPageClient program={program} />;
}

export async function generateStaticParams() {
    return Object.keys(programs).map((slug) => ({
        slug,
    }));
}
