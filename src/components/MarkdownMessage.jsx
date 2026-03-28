import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export function MarkdownMessage({ children }) {
  return (
    <div className="chat-markdown max-w-none text-[15px] leading-relaxed text-zinc-100 [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-600 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-400 [&_a]:text-violet-400 [&_a]:underline [&_a]:underline-offset-2 [&_hr]:my-4 [&_hr]:border-zinc-700 [&_table]:my-3 [&_table]:w-full [&_th]:border [&_th]:border-zinc-700 [&_th]:bg-zinc-800 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_td]:border [&_td]:border-zinc-700 [&_td]:px-2 [&_td]:py-1 [&_strong]:font-semibold [&_strong]:text-zinc-50">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre({ children }) {
            return (
              <pre className="scrollbar-thin my-3 overflow-x-auto rounded-xl border border-zinc-700/80 bg-zinc-950/90 p-4 font-mono text-[13px] shadow-inner">
                {children}
              </pre>
            )
          },
          code(props) {
            const { className, children, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            const isBlock = Boolean(match)

            if (isBlock) {
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              )
            }

            return (
              <code
                className="rounded-md bg-zinc-800/90 px-1.5 py-0.5 font-mono text-[0.9em] text-violet-200"
                {...rest}
              >
                {children}
              </code>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
