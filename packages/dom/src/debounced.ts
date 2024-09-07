import type { Unhead } from '@unhead/schema'
import { renderDOMHead } from './renderDOMHead'
import type { RenderDomHeadOptions } from './renderDOMHead'

export interface DebouncedRenderDomHeadOptions extends RenderDomHeadOptions {
  /**
   * Specify a custom delay function for delaying the render.
   */
  delayFn?: (fn: () => void) => void
}

/**
 * Queue a debounced update of the DOM head.
 */
export function debouncedRenderDOMHead<T extends Unhead<any>>(head: T, options: DebouncedRenderDomHeadOptions = {}) {
  const fn = options.delayFn || (fn => setTimeout(fn, 10))
  return head._domDebouncedUpdatePromise = head._domDebouncedUpdatePromise || new Promise<void>(resolve => fn(() => {
    return renderDOMHead(head, options)
      .then(() => {
        delete head._domDebouncedUpdatePromise
        resolve()
      })
  }))
}
