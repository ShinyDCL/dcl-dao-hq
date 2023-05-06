import { createBoard } from './board';
import { createEntity } from './entity';

const scene = createEntity(
  { position: new Vector3(16, 0, 16), rotation: Quaternion.Euler(0, 0, 0) },
  'models/scene.glb'
);

void executeTask(async () => {
  try {
    const response = await fetch(
      'https://governance.decentraland.org/api/proposals?limit=9&offset=0'
    );
    const json = await response.json();
    const board = createBoard(
      json?.data?.map((entry: { id: string; title: string }) => ({
        title: entry.title,
        url: `https://governance.decentraland.org/proposal/?id=${entry.id}`,
      }))
    );
    board.setParent(scene);
    log(json);
  } catch {
    log('failed to fetch proposals');
  }
});
