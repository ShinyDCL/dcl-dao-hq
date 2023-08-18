import { engine, executeTask, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { SCENE_MIDDLE } from './config'
import { createTopVoterBoard, createVotingBoard } from './board'
import { createLaptops } from './laptops'

export function main() {
  const scene = engine.addEntity(false)
  Transform.create(scene, { position: Vector3.create(SCENE_MIDDLE, 0, SCENE_MIDDLE) })
  GltfContainer.create(scene, { src: 'models/scene.glb' })

  createLaptops(scene)

  executeTask(async () => {
    await createVotingBoard(scene)
  })

  executeTask(async () => {
    await createTopVoterBoard(scene)
  })
}
