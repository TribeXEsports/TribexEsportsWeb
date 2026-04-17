"use client"

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
    text: string
    className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!text || text.includes("WAITING") || text.includes("SECURED")) return

        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "p-1.5 rounded-md hover:bg-white/10 transition-all flex items-center gap-2 group/copy",
                className
            )}
            title="Copy to clipboard"
        >
            {copied ? (
                <Check className="size-3 text-emerald-500" />
            ) : (
                <Copy className="size-3 text-zinc-500 group-hover/copy:text-white transition-colors" />
            )}
        </button>
    )
}
