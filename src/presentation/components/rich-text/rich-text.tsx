import type { InlineNode, RichBlock } from '@domain/rich-text/rich-text'
import { evidenceUrl } from '@presentation/lib/site'
import styles from './rich-text.module.scss'

interface RichTextProps {
  blocks: readonly RichBlock[]
}

export function RichText({ blocks }: RichTextProps) {
  return (
    <div className={styles.root}>
      {blocks.map((block, index) => (
        <BlockView key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  )
}

function BlockView({ block }: { block: RichBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p>
          <Inlines nodes={block.content} />
        </p>
      )
    case 'heading':
      return block.level === 2 ? <h2>{block.text}</h2> : <h3>{block.text}</h3>
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag>
          {block.items.map((item, index) => (
            <li key={index}>
              <Inlines nodes={item} />
            </li>
          ))}
        </ListTag>
      )
    }
    case 'code':
      return (
        <figure className={styles.code}>
          <figcaption>{block.language}</figcaption>
          <pre>
            <code>{block.code}</code>
          </pre>
        </figure>
      )
    case 'quote':
      return (
        <blockquote>
          <Inlines nodes={block.content} />
        </blockquote>
      )
    case 'image':
      return (
        <figure className={styles.figure}>
          <img src={evidenceUrl(block.src)} alt={block.alt} loading="lazy" decoding="async" />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      )
    case 'callout':
      return (
        <aside className={styles[block.tone]}>
          {block.title ? <p className={styles.calloutTitle}>{block.title}</p> : null}
          <p>
            <Inlines nodes={block.content} />
          </p>
        </aside>
      )
    default: {
      const unreachable: never = block
      return unreachable
    }
  }
}

function Inlines({ nodes }: { nodes: readonly InlineNode[] }) {
  return nodes.map((node, index) => {
    const key = `${node.type}-${index}`
    switch (node.type) {
      case 'text':
        return <span key={key}>{node.value}</span>
      case 'strong':
        return <strong key={key}>{node.value}</strong>
      case 'code':
        return (
          <code key={key} className={styles.inlineCode}>
            {node.value}
          </code>
        )
      case 'link':
        return (
          <a key={key} href={node.href} target="_blank" rel="noreferrer">
            {node.label}
          </a>
        )
      default: {
        const unreachable: never = node
        return unreachable
      }
    }
  })
}
