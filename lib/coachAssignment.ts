export interface Coach {
    id: string;
    name: string;
    languages: string[];
    specialties: string[];
}

export const coaches: Coach[] = [
    {
        id: 'coach-001',
        name: 'Sarah Martinez',
        languages: ['fr', 'en'],
        specialties: ['declic-durable', 'systeme-apex', 'elan-senior', 'renaissance'],
    },
];

export function assignCoach(userLanguage: string, program: string): Coach | null {
    const compatibleCoaches = coaches.filter(
        (coach) =>
            coach.languages.includes(userLanguage.toLowerCase()) &&
            coach.specialties.includes(program)
    );

    // Pour l'instant, retourne le premier coach compatible
    return compatibleCoaches.length > 0 ? compatibleCoaches[0] : null;
}
