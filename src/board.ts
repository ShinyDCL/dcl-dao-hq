import {
  Entity,
  GltfContainer,
  InputAction,
  TextShape,
  Transform,
  engine,
  executeTask,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { getProposals, getTodaysVotes, getUserProfiles } from './api'
import { GOVERNANCE_URL } from './config'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { openExternalUrl } from '~system/RestrictedActions'

export interface BoardItem {
  title: string
  url: string
}

export const setUpBoards = (parent: Entity) => {
  executeTask(async () => {
    await createVotingBoard(parent)
  })

  executeTask(async () => {
    await createTopVoterBoard(parent)
  })
}

export const createVotingBoard = async (parent: Entity): Promise<Entity> => {
  const proposals = await getProposals(9, 0)
  const boardData = proposals?.map(({ title, id }) => ({ title, url: `${GOVERNANCE_URL}/proposal/?id=${id}` }))

  const board = createBoard(boardData)
  Transform.create(board, { position: Vector3.create(4.86, 2.45, 4.5), parent })

  return board
}

export const createTopVoterBoard = async (parent: Entity): Promise<Entity> => {
  const votes = await getTodaysVotes()
  const voters: Record<string, number> = {}

  votes?.forEach(({ voter }) => {
    const address = voter.toLowerCase()
    voters[address] = (voters[address] || 0) + 1
  })

  const topVoters = Object.keys(voters)
    .map((voter) => ({ address: voter, voteCount: voters[voter] }))
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 9)

  const topVoterAddresses = topVoters.map((voter) => voter.address)
  const profiles = await getUserProfiles(topVoterAddresses)

  const boardData: BoardItem[] = topVoters.map(({ address, voteCount }, index) => {
    const profile = profiles?.find((profile) => profile.avatars?.[0]?.ethAddress.toLowerCase() === address)

    const name = profile?.avatars?.[0]?.name || address
    return {
      title: `${index + 1}. ${name} (${voteCount} votes)`,
      url: `${GOVERNANCE_URL}/profile/?address=${address}`
    }
  })

  const board = createBoard(boardData)
  Transform.create(board, { position: Vector3.create(-7.26, 2.45, 4.5), parent })

  return board
}

export const createBoard = (data?: BoardItem[]): Entity => {
  const rowCount = 3
  const columnCount = 3
  const board = engine.addEntity()

  data?.forEach(({ title, url }: BoardItem, index: number) => {
    const boardItem = engine.addEntity()

    Transform.create(boardItem, {
      position: Vector3.create((index % columnCount) * 1.2, Math.floor(index / rowCount) * -0.66, 0),
      parent: board
    })
    GltfContainer.create(boardItem, { src: 'models/placeholder.glb' })

    pointerEventsSystem.onPointerDown(
      {
        entity: boardItem,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Open' }
      },
      () => openExternalUrl({ url })
    )

    const textEntity = engine.addEntity()
    TextShape.create(textEntity, {
      text: title,
      fontSize: 1,
      textColor: Color4.White(),
      height: 1,
      width: 1.1,
      textWrapping: true,
      lineSpacing: -0.5
    })
    Transform.create(textEntity, {
      position: Vector3.create(0, 0.3, -0.05),
      parent: boardItem
    })
  })

  return board
}
