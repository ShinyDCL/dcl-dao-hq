import { Entity, InputAction, MeshCollider, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { BUILDER_URL, EVENTS_URL, GOVERNANCE_URL, MARKET_URL, PLACES_URL } from './config'
import { openExternalUrl } from '~system/RestrictedActions'

const laptopConfig = [
  {
    transform: {
      position: Vector3.create(-4.745, 1.42, -8.44),
      rotation: Quaternion.fromEulerDegrees(0, 8, 20)
    },
    url: MARKET_URL,
    title: 'Market'
  },
  {
    transform: {
      position: Vector3.create(-8.16, 1.42, 1.25),
      rotation: Quaternion.fromEulerDegrees(0, 78, 20)
    },
    url: PLACES_URL,
    title: 'Places'
  },

  {
    transform: {
      position: Vector3.create(-8.44, 1.42, 1.88),
      rotation: Quaternion.fromEulerDegrees(0, 205.5, 20)
    },
    url: GOVERNANCE_URL,
    title: 'DAO'
  },
  {
    transform: {
      position: Vector3.create(4.61, 1.42, -8.34),
      rotation: Quaternion.fromEulerDegrees(0, 77, 20)
    },
    url: EVENTS_URL,
    title: 'Events'
  },
  {
    transform: {
      position: Vector3.create(3.62, 1.42, -1.86),
      rotation: Quaternion.fromEulerDegrees(0, 255, 20)
    },
    url: BUILDER_URL,
    title: 'Builder'
  }
]

const defaultScale = Vector3.create(0.01, 0.5, 0.84)

export const setUpLaptops = (parent: Entity) => {
  laptopConfig.forEach(({ title, transform, url }) => {
    const entity = engine.addEntity()

    MeshCollider.setBox(entity)
    Transform.create(entity, { ...transform, scale: defaultScale, parent })

    pointerEventsSystem.onPointerDown(
      {
        entity,
        opts: { button: InputAction.IA_POINTER, hoverText: title }
      },
      () => {
        openExternalUrl({ url })
      }
    )
  })
}
