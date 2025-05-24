import React from 'react';
import { AVAILABLE_TAGS } from './tags';
import "../../styles/form.css"

interface TagSelectorProps {
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    maxTags?: number;
    readOnly?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
    selectedTags,
    onTagsChange,
    maxTags = 10,
    readOnly = false
}) => {
    const handleTagToggle = (tagId: string) => {
        if (readOnly) return;

        if (selectedTags.includes(tagId)) {
            onTagsChange(selectedTags.filter(id => id !== tagId));
        } else if (selectedTags.length < maxTags) {
            onTagsChange([...selectedTags, tagId]);
        }
    };

    // In read-only mode, only show selected tags
    const tagsToShow = readOnly ? AVAILABLE_TAGS.filter(tag => selectedTags.includes(tag.id)) : AVAILABLE_TAGS;

    if (readOnly && selectedTags.length === 0) {
        return (
            <div className="form-group">
                <label>Tags:</label>
                <div style={{ marginTop: '8px', color: '#6b7280', fontStyle: 'italic' }}>
                    No tags selected
                </div>
            </div>
        );
    }

    return (
        <div className="form-group">
            <label className="form-label">
                {readOnly ? 'Tags:' : `Select Tags (${selectedTags.length}/${maxTags}):`}
            </label>
            <div className={readOnly ? 'form-grid-auto' : 'form-grid-3'}>
                {tagsToShow.map(tag => {
                    const isSelected = selectedTags.includes(tag.id);
                    const isDisabled = readOnly || (!isSelected && selectedTags.length >= maxTags);

                    const buttonClasses = [
                        'form-tag-button',
                        isSelected ? 'selected' : '',
                        readOnly ? 'readonly' : ''
                    ].filter(Boolean).join(' ');

                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagToggle(tag.id)}
                            disabled={isDisabled}
                            className={buttonClasses}
                            title={tag.description}
                        >
                            <div className="form-tag-content">
                                <span className="form-tag-icon">{tag.icon}</span>
                                <span className="form-tag-label">{tag.label}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
            {!readOnly && selectedTags.length > 0 && (
                <div className="form-helper-text">
                    Selected: {selectedTags.map(id =>
                        AVAILABLE_TAGS.find(t => t.id === id)?.label
                    ).join(', ')}
                </div>
            )}
        </div>
    );
};
