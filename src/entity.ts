export const createEntity = (
  transform: TransformConstructorArgs,
  modelPath: string
): Entity => {
  const entity = new Entity();
  const shape = new GLTFShape(modelPath);

  shape.withCollisions = true;
  shape.isPointerBlocker = true;
  shape.visible = true;

  entity.addComponentOrReplace(new Transform(transform));
  entity.addComponentOrReplace(shape);

  engine.addEntity(entity);
  return entity;
};
