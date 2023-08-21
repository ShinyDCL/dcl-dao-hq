import { engine, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { SCENE_MIDDLE } from './config'
import { setUpVideoPlayer } from './videoPlayer'
import { setUpLaptops } from './laptops'
import { setUpBoards } from './board'
import { setUpSkyBox } from './skyBox'

export function main() {
  const scene = engine.addEntity(false)
  Transform.create(scene, { position: Vector3.create(SCENE_MIDDLE, 0, SCENE_MIDDLE) })
  GltfContainer.create(scene, { src: 'models/scene.glb' })

  const border = engine.addEntity(false)
  Transform.create(border, { parent: scene })
  GltfContainer.create(border, { src: 'models/border.glb' })

  setUpLaptops(scene)
  setUpVideoPlayer(scene)
  setUpBoards(scene)
  setUpSkyBox(scene)
}
