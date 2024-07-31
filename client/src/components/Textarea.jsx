import React, { useState, useRef, useEffect } from 'react'

function Textarea({
    value, setValue,
    placeholder, maxLength,
    attribute
}) {
    const textareaRef = useRef(null)
    const [isFocused, setIsFocused] = useState(false)

    function autoResize() {
        const textarea = textareaRef.current
        
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${ textarea.scrollHeight }px`
        }
    }

    useEffect(() => {
        autoResize()

        function handleResize() {
            autoResize()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [value])

    return (
        <textarea 
            className={`${ attribute } w-full p-3 box-border rounded-3xl overflow-hidden resize-none`}
            ref={ textareaRef } value={ value } maxLength={ maxLength }
            onChange={ e => { setValue(e.target.value) } } placeholder={ placeholder } 
            spellCheck={ isFocused }
            onFocus={ () => { setIsFocused(true) } }
            onBlur={ () => { setIsFocused(false) } }
            rows={ 1 }
        />
    )
}

export default Textarea