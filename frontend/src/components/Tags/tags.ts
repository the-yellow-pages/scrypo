export interface Tag {
    id: string;
    icon: string;
    label: string;
    description: string;
}

export const AVAILABLE_TAGS: Tag[] = [
    {
        id: 'crypto-business',
        icon: '🏪',
        label: 'Crypto-Friendly Business',
        description: 'Tag places that accept crypto for payments (cafés, bars, shops, etc.).'
    },
    {
        id: 'crypto-services',
        icon: '💼',
        label: 'Crypto-Friendly Services',
        description: 'Tag service providers (hairdressers, co-working spaces, etc.) that accept crypto.'
    },
    {
        id: 'chat-coffee',
        icon: '☕',
        label: 'Chat & Coffee',
        description: 'For casual meetups, coworking, or travelers looking to hang out and talk.'
    },
    {
        id: 'night-out',
        icon: '🥂',
        label: 'Night Out',
        description: 'Find people to go out with — bars, events, nightlife.'
    },
    {
        id: 'chill-game',
        icon: '🎮',
        label: 'Chill & Game',
        description: 'Connect for casual gaming, board games, or hanging out.'
    },
    {
        id: 'jam-session',
        icon: '🎨',
        label: 'Jam Session',
        description: 'For artistic or creative collaboration — music, drawing, content creation.'
    },
    {
        id: 'travel-buddy',
        icon: '🧭',
        label: 'Travel Buddy',
        description: 'For people who want to explore the city together, go sightseeing, or do social activities.'
    }
];
