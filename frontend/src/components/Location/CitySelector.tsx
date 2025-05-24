import { useState, useEffect, useRef } from "react"
import "../../styles/form.css"

interface CityResult {
    id: string
    place_name: string
    center: [number, number] // [longitude, latitude]
    text: string
    context?: Array<{ id: string; text: string }>
}

interface CitySelectorProps {
    onCitySelect: (city: { name: string; latitude: number; longitude: number }) => void
    placeholder?: string
    disabled?: boolean
    initialValue?: string
}

export const CitySelector = ({
    onCitySelect,
    placeholder = "Search for a city...",
    disabled = false,
    initialValue = ""
}: CitySelectorProps) => {
    const [searchTerm, setSearchTerm] = useState(initialValue)
    const [results, setResults] = useState<CityResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const mapboxAPIToken = "pk.eyJ1Ijoic3RldmVuZHNheWxvciIsImEiOiJja295ZmxndGEwbGxvMm5xdTc3M2MwZ2xkIn0.WDBLMZYfh-ZGFjmwO82xvw"

    // Debounced search effect
    useEffect(() => {
        if (!searchTerm.trim() || searchTerm.length < 2) {
            setResults([])
            setIsOpen(false)
            return
        }

        const timeoutId = setTimeout(async () => {
            await searchCities(searchTerm)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSelectedIndex(-1)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const searchCities = async (query: string) => {
        if (!query.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxAPIToken}&types=place&limit=5`
            )

            if (!response.ok) {
                throw new Error('Failed to fetch cities')
            }

            const data = await response.json()
            setResults(data.features || [])
            setIsOpen(true)
            setSelectedIndex(-1)
        } catch (error) {
            console.error('Error searching cities:', error)
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleCitySelect = (city: CityResult) => {
        const [longitude, latitude] = city.center
        setSearchTerm(city.place_name)
        setIsOpen(false)
        setSelectedIndex(-1)

        onCitySelect({
            name: city.place_name,
            latitude,
            longitude
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    handleCitySelect(results[selectedIndex])
                }
                break
            case 'Escape':
                setIsOpen(false)
                setSelectedIndex(-1)
                inputRef.current?.blur()
                break
        }
    }

    const formatCityDisplay = (city: CityResult) => {
        const context = city.context || []
        const country = context.find(item => item.id.includes('country'))?.text
        const state = context.find(item => item.id.includes('region'))?.text

        let display = city.text
        if (state) display += `, ${state}`
        if (country) display += `, ${country}`

        return display
    }

    return (
        <div>
            <label htmlFor="city-search" className="form-label">
                City:
            </label>
            <div ref={containerRef} style={{ position: 'relative' }}>
                <input
                    ref={inputRef}
                    type="text"
                    id="city-search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true)
                    }}
                    placeholder={placeholder}
                    className="form-input"
                    disabled={disabled}
                    autoComplete="off"
                />

                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '12px',
                        color: '#6b7280'
                    }}>
                        Searching...
                    </div>
                )}

                {isOpen && results.length > 0 && (
                    <div
                        ref={dropdownRef}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#ffffff',
                            border: '2px solid #d1d5db',
                            borderTop: 'none',
                            borderRadius: '0 0 8px 8px',
                            maxHeight: '120px',
                            overflowY: 'auto',
                            zIndex: 1000,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {results.map((city, index) => (
                            <div
                                key={city.id}
                                onClick={() => handleCitySelect(city)}
                                style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: index === selectedIndex ? '#dbeafe' : 'transparent',
                                    borderBottom: index < results.length - 1 ? '1px solid #e5e7eb' : 'none'
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div style={{ fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                                    {city.text}
                                </div>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                    {formatCityDisplay(city)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
