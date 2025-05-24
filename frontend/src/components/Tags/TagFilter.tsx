import React, { useState } from 'react';
import { TagSelector } from './TagSelector';
import { AVAILABLE_TAGS } from './tags';
import "../../styles/form.css"

interface TagFilterProps {
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    maxTags?: number;
}

export const TagFilter: React.FC<TagFilterProps> = ({
    selectedTags,
    onTagsChange,
    maxTags = 10
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClearAll = () => {
        onTagsChange([]);
    };

    return (
        <div className="tag-filter-container" style={{ position: 'relative', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="tag-filter-toggle"
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <span>Tags Filter</span>
                    {selectedTags.length > 0 && (
                        <span style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '12px',
                            padding: '2px 8px',
                            fontSize: '0.75rem'
                        }}>
                            {selectedTags.length}
                        </span>
                    )}
                    <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        ▼
                    </span>
                </button>

                {selectedTags.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearAll}
                        style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #ef4444',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                        }}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        padding: '1rem'
                    }}
                >
                    <TagSelector
                        selectedTags={selectedTags}
                        onTagsChange={onTagsChange}
                        maxTags={maxTags}
                        readOnly={false}
                    />
                </div>
            )}
        </div>
    );
};
