import { Entity, GltfContainer, InputAction, Transform, TransformType, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { openExternalUrl } from '~system/RestrictedActions'

export enum LinkType {
  TWITTER = 'Twitter',
  GITHUB = 'Github'
}

export const URLS: Record<LinkType, string> = {
  [LinkType.GITHUB]: 'https://github.com/ShinyDCL/dcl-dao-hq',
  [LinkType.TWITTER]: 'https://twitter.com/ShinyDCL/status/1655647794709815320'
} as const

export const LINK_MODELS: Record<LinkType, string> = {
  [LinkType.GITHUB]: 'models/links/github.glb',
  [LinkType.TWITTER]: 'models/links/twitter.glb'
} as const

export const createLinkEntity = (transform: Partial<TransformType>, linkType: LinkType): Entity => {
  const entity = engine.addEntity()
  Transform.create(entity, transform)
  GltfContainer.create(entity, { src: LINK_MODELS[linkType] })

  pointerEventsSystem.onPointerDown({ entity, opts: { button: InputAction.IA_POINTER, hoverText: linkType } }, () => {
    openExternalUrl({ url: URLS[linkType] })
  })

  return entity
}

export const setupLinks = (parent: Entity): void => {
  createLinkEntity({ position: { x: -5, y: 1.3, z: -14 }, parent }, LinkType.GITHUB)
  createLinkEntity({ position: { x: -4, y: 1.3, z: -14 }, parent }, LinkType.TWITTER)
}
