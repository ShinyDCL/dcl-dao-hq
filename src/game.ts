import { createTopVoterBoard, createVotingBoard } from './board';
import { createEntity } from './entity';

const scene = createEntity(
  { position: new Vector3(16, 0, 16), rotation: Quaternion.Euler(0, 0, 0) },
  'models/scene.glb'
);

void executeTask(async () => {
  await createVotingBoard(scene);
});

void executeTask(async () => {
  await createTopVoterBoard(scene);
});
