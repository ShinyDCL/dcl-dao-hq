import { getProposals, getTodaysVotes, getUserProfiles } from './api';
import { GOVERNANCE_URL } from './config';

export interface BoardItem {
  title: string;
  url: string;
}

const placeholderShape = new GLTFShape('models/placeholder.glb');

export const createVotingBoard = async (parent: Entity): Promise<Entity> => {
  const proposals = await getProposals(9, 0);
  const boardData = proposals?.map((proposal) => ({
    title: proposal.title,
    url: `${GOVERNANCE_URL}/proposal/?id=${proposal.id}`,
  }));

  const board = createBoard(parent, boardData);
  board.addComponentOrReplace(
    new Transform({
      position: new Vector3(4.86, 2.45, 4.5),
    })
  );
  return board;
};

export const createTopVoterBoard = async (parent: Entity): Promise<Entity> => {
  const votes = await getTodaysVotes();
  const voters =
    votes?.reduce((acc: Record<string, number>, vote) => {
      const address: string = vote.voter.toLowerCase();
      acc[address] = (acc[address] || 0) + 1;
      return acc;
    }, {}) || {};

  const topVoters = Object.keys(voters)
    .map((voter) => ({
      address: voter,
      voteCount: voters[voter],
    }))
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 9);

  const topVoterAddresses = topVoters.map((voter) => voter.address);
  const profiles = await getUserProfiles(topVoterAddresses);

  const boardData: BoardItem[] = topVoters.map(
    ({ address, voteCount }, index) => {
      const profile = profiles?.filter(
        (profile) => profile.avatars?.[0]?.ethAddress.toLowerCase() === address
      )?.[0];

      const name = profile?.avatars?.[0]?.name || address;
      return {
        title: `${index + 1}. ${name} (${voteCount} votes)`,
        url: `${GOVERNANCE_URL}/profile/?address=${address}`,
      };
    }
  );

  const board = createBoard(parent, boardData);
  board.addComponentOrReplace(
    new Transform({
      position: new Vector3(-7.26, 2.45, 4.5),
    })
  );
  return board;
};

export const createBoard = (parent: Entity, data?: BoardItem[]): Entity => {
  const rowCount = 3;
  const columnCount = 3;
  const board = new Entity();

  data?.forEach(({ title, url }: BoardItem, index: number) => {
    const boardItem = new Entity();
    boardItem.addComponentOrReplace(
      new Transform({
        position: new Vector3(
          (index % columnCount) * 1.2,
          Math.floor(index / rowCount) * -0.66,
          0
        ),
      })
    );

    boardItem.addComponent(placeholderShape);
    boardItem.addComponent(
      new OnPointerDown(
        () => {
          openExternalURL(url);
        },
        { hoverText: 'Open' }
      )
    );

    const textEntity = new Entity();
    textEntity.addComponentOrReplace(
      new Transform({
        position: new Vector3(0, 0.3, -0.05),
      })
    );
    const textShape = new TextShape(title);
    textShape.fontSize = 1;
    textShape.color = Color3.White();
    textShape.font = new Font(Fonts.SansSerif);
    textShape.height = 1;
    textShape.width = 1.1;
    textShape.textWrapping = true;
    textShape.lineSpacing = '-10px';
    textEntity.addComponent(textShape);
    textEntity.setParent(boardItem);
    boardItem.setParent(board);
  });

  board.setParent(parent);

  return board;
};
