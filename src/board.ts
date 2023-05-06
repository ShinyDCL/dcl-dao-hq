const placeholderShape = new GLTFShape('models/placeholder.glb');

export const createBoard = (
  data?: { title: string; url: string }[]
): Entity => {
  const rowCount = 3;
  const columnCount = 3;
  const board = new Entity();

  board.addComponentOrReplace(
    new Transform({
      position: new Vector3(4.05, 1.12, 4.5),
    })
  );

  data?.forEach((proposal, index: number) => {
    const boardItem = new Entity();
    boardItem.addComponentOrReplace(
      new Transform({
        position: new Vector3(
          (index % columnCount) * 1.2,
          Math.floor(index / rowCount) * 0.66,
          0
        ),
      })
    );

    boardItem.addComponent(placeholderShape);
    boardItem.addComponent(
      new OnPointerDown(
        () => {
          openExternalURL(proposal.url);
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
    const textShape = new TextShape(proposal.title);
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

  return board;
};
