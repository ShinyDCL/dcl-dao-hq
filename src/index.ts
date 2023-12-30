import { engine, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

import { setUpBoards } from './board'
import { SCENE_MIDDLE } from './config'
import { setUpLaptops } from './laptops'
import { setupLinks } from './links'
import { setUpSkyBox } from './skyBox'
import { setUpVideoPlayer } from './videoPlayer'

export function main() {
  const scene = engine.addEntity()
  Transform.create(scene, { position: Vector3.create(SCENE_MIDDLE, 0, SCENE_MIDDLE) })
  GltfContainer.create(scene, { src: 'models/scene.glb' })

  const border = engine.addEntity()
  Transform.create(border, { parent: scene })
  GltfContainer.create(border, { src: 'models/border.glb' })

  setupLinks(scene)
  setUpLaptops(scene)
  setUpVideoPlayer(scene)
  setUpBoards(scene)
  setUpSkyBox(scene)
}
