'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface RespondButtonProps {
  taskId: number
  className?: string
}

export function RespondButton({ taskId, className }: RespondButtonProps) {
  const [open, setOpen] = useState(false)
  const [price, setPrice] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: отправить отклик через Server Action
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setOpen(false)
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className={`bg-[#0d7a5f] hover:bg-[#0a6149] text-white ${className ?? ''}`}
      >
        Откликнуться на задание
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="price" className="block text-xs font-semibold text-gray-700 mb-1">
          Ваша цена (руб.)
        </label>
        <input
          id="price"
          type="number"
          placeholder="например 500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#0d7a5f] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="text" className="block text-xs font-semibold text-gray-700 mb-1">
          Сообщение заказчику
        </label>
        <textarea
          id="text"
          placeholder="Расскажите почему вы подходите для этого задания..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#0d7a5f] focus:outline-none resize-none"
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#0d7a5f] hover:bg-[#0a6149] text-white"
        >
          {loading ? 'Отправка...' : 'Отправить отклик'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          className="border-gray-300"
        >
          Отмена
        </Button>
      </div>
    </form>
  )
}
