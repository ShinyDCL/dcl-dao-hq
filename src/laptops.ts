import {
  BUILDER_URL,
  EVENTS_URL,
  GOVERNANCE_URL,
  MARKET_URL,
  PLACES_URL,
} from './config';

const material = new Material();
material.albedoColor = new Color4(0, 0, 0, 0);
material.castShadows = false;
const defaultScale = new Vector3(0.01, 0.5, 0.84);
const laptops = [
  {
    transform: {
      position: new Vector3(-4.745, 1.42, -8.44),
      rotation: Quaternion.Euler(0, 8, 20),
    },
    url: MARKET_URL,
    title: 'Market',
  },
  {
    transform: {
      position: new Vector3(-8.16, 1.42, 1.25),
      rotation: Quaternion.Euler(0, 78, 20),
    },
    url: PLACES_URL,
    title: 'Places',
  },

  {
    transform: {
      position: new Vector3(-8.44, 1.42, 1.88),
      rotation: Quaternion.Euler(0, 205.5, 20),
    },
    url: GOVERNANCE_URL,
    title: 'DAO',
  },
  {
    transform: {
      position: new Vector3(4.61, 1.42, -8.34),
      rotation: Quaternion.Euler(0, 77, 20),
    },
    url: EVENTS_URL,
    title: 'Events',
  },
  {
    transform: {
      position: new Vector3(3.62, 1.42, -1.86),
      rotation: Quaternion.Euler(0, 255, 20),
    },
    url: BUILDER_URL,
    title: 'Builder',
  },
];

export const createLaptops = (parent: Entity) => {
  laptops.forEach((laptop) => {
    const entity = new Entity();
    const boxShape = new BoxShape();

    entity.addComponent(material);
    entity.addComponent(boxShape);
    entity.addComponentOrReplace(
      new Transform({
        scale: defaultScale,
        ...laptop.transform,
      })
    );

    entity.addComponentOrReplace(
      new OnPointerDown(
        () => {
          openExternalURL(laptop.url);
        },
        { hoverText: laptop.title }
      )
    );

    entity.setParent(parent);
  });
};
