import { Entity, Material, MeshRenderer, Transform, VideoPlayer, engine } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export const setUpVideoPlayer = (parent: Entity) => {
  const screen = engine.addEntity()
  MeshRenderer.setPlane(screen)
  Transform.create(screen, { position: Vector3.create(0, 11.68, 2.19), scale: Vector3.create(7, 3.94, 1), parent })

  VideoPlayer.create(screen, {
    src: 'videos/buildingRender.mp4',
    playing: true,
    loop: true
  })

  const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })

  Material.setPbrMaterial(screen, {
    texture: videoTexture,
    roughness: 1.0,
    specularIntensity: 0,
    metallic: 0
  })
}
