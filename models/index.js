const models = {
    bed: {
        modelStr: "models/bed/bed.json",
        modelTextures: ["models/bed/bed_d.png"],
    },

    chair: {
        modelStr: 'models/chair/chair.json',
        modelTextures: ['models/chair/chair.png'],
    },

    closet: {
        modelStr: 'models/closet/closet.json',
        modelTextures: ['models/closet/closet.png'],
    },

    sofa: {
        modelStr: 'models/sofa/sofa.json',
        modelTextures:
            ['models/sofa/verde.jpg',
                'models/sofa/url.jpg',
                'models/sofa/bianco.jpg',
                'models/sofa/TEXT_MDF.jpg'],
    },

    sofa2: {
        modelStr: 'models/sofa2/sofa2.json',
        modelTextures: ['models/sofa2/mufiber03.png',
                        'models/sofa/verde.jpg',
                        'models/sofa/url.jpg',
                        'models/sofa/bianco.jpg',
                        'models/sofa/TEXT_MDF.jpg'],
    },

    /*table: {
        model: null,
        modelStr: 'models/table/wooden-coffe-table.json',
        modelTextures: ['models/table/wooden-coffe-table.jpg'],
        modelData: null,

    },*/

    wall: {
        modelStr: 'models/empty_room/EmptyRoom.json',
        modelTextures: ['models/empty_room/Wall.jpg'],

    },

    floor: {
        modelStr: 'models/empty_room/EmptyRoom.json',
        modelTextures: ['models/empty_room/Floor.jpg'],
    },

}

const items = [
    {
        parent: {
            position: [-9, -0.4, -61],
        },
        body: {
            position: [0, 0, 0],
            rotation: [0, 90, 0],
            scale: [20, 20, 20]
        },
        model: "wall",
    },
    {
        parent: {
            position: [66, -1.0, -61.53],
        },
        body: {
            position: [0, 0, 0],
            rotation: [0, 90, 0],
            scale: [20, 20, 20]
        },
        model: "wall",
    },
    {
        parent: {
            position: [-9, 0.2, 40],
        },
        body: {
            position: [0, 0, 0],
            rotation: [0, 90, 0],
            scale: [20, 20, 20]
        },
        model: "wall",
    },
    {
        parent: {
            position: [66, -0.2, 39.37],
        },
        body: {
            position: [0, 0, 0],
            rotation: [0, 90, 0],
            scale: [20, 20, 20]
        },
        model: "wall",
    },
    {
        parent: {
            position: [-50, 209.0, 50],
        },
        body: {
            position: [0, 0, 0],
            rotation: [0, 0, 90],
            scale: [100, 100, 100]
        },
        model: "floor",
    },
    {
        parent: {
            position: [-89.5, 0.5, 95],
        },
        body: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [20, 20, 20]
        },
        model: "wall",
    },
    {
        parent: {
            position: [-90, 0, 20],
        },
        body: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [20, 20, 20]
        },
        model: "wall",
    },
    {
        parent: {
            position: [60.5, -0.6, 92],
        },
        body: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [20, 20, 20]
        },
        model: "wall",
    },
    {
        parent: {
            position: [60, -1.1, 19],
        },
        body: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [20, 20, 20]
        },
        model: "wall",
    },
    {
        parent: {
            position: [-18.0, 0.0, 5.0],
        },
        body: {
            position: [0.0, 0.03, 0.0],
            rotation: [0.0, 0.0, 0.0],
            scale: [8.0, 8.0, 8.0]
        },
        model: "bed",
    },
    {
        parent: {
            position: [71.0, 0.0, -10.0],
        },
        body: {
            position: [0.0, -2.75, 0.0],
            rotation: [0.0, 180.0, 0.0],
            scale: [1.0, 1.0, 1.0]
        },
        model: "sofa",
    },
    {
        parent: {
            position: [-10.0, 0.0, 60.0],
        },
        body: {
            position: [0.0, 0.0, -1.0],
            rotation: [0.0, 180.0, 0.0],
            scale: [12.0, 12.0, 12.0]
        },
        model: "sofa2",
    },
    {
        parent: {
            position: [20.0, 0.0, 60.0],
        },
        body: {
            position: [0.0, 0.0, -1.0],
            rotation: [0.0, 180.0, 0.0],
            scale: [12.0, 12.0, 12.0]
        },
        model: "sofa2",
    },
    {
        parent: {
            position: [50.0, 0.0, 60.0],
        },
        body: {
            position: [0.0, 0.0, -1.0],
            rotation: [0.0, 180.0, 0.0],
            scale: [12.0, 12.0, 12.0]
        },
        model: "sofa2",
    },
    {
        parent: {
            position: [80.0, 0.0, 60.0],
        },
        body: {
            position: [0.0, 0.0, -1.0],
            rotation: [0.0, 180.0, 0.0],
            scale: [12.0, 12.0, 12.0]
        },
        model: "sofa2",
    },
    {
        parent: {
            position: [1.0, 0.0, -10.0],
        },
        body: {
            position: [100.0, 0.0, 5.0],
            rotation: [-90.0, 0.0, 0.0],
            scale: [0.1, 0.1, 0.1]
        },
        model: "chair",
    },
    {
        parent: {
            position: [41.0, 0.0, -10.0],
        },
        body: {
            position: [0.0, 0.67, 0.0],
            rotation: [0.0, 180.0, 0.0],
            scale: [27.0, 27.0, 27.0]
        },
        model: "closet",
    },
]

