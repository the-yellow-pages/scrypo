import React from 'react';
import { AVAILABLE_TAGS } from './tags';
import "../../styles/form.css"

interface TagChipProps {
    tagId: string;
    onRemove?: () => void;
    size?: 'sm' | 'md';
}

export const TagChip: React.FC<TagChipProps> = ({
    tagId,
    onRemove,
    size = 'md'
}) => {
    const tag = AVAILABLE_TAGS.find(t => t.id === tagId);

    if (!tag) return null;

    const chipClasses = [
        'form-chip',
        size === 'sm' ? 'form-chip-small' : ''
    ].filter(Boolean).join(' ');

    return (
        <span className={chipClasses}>
            <span>{tag.icon}</span>
            <span>{tag.label}</span>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="form-chip-remove"
                >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </span>
    );
};
