
const CloudsConfig = {
    show: true,
    maxCount: 20,
    showStepTime: 50,
    speed: {
        min: 0.1,
        max: 0.5,
    },
    height: {
        min: 5,
        max: 8,
    },
    scale: {
        min: 0.8,
        max: 1.2,
    },
    countByRadius: [
        {
            radius: [1, 2],
            count: 1,
        },
        {
            radius: [3, 4],
            count: 2,
        },
        {
            radius: [5, 7],
            count: 5,
        },
        {
            radius: [8, 10],
            count: 8,
        },
        {
            radius: [11, 14],
            count: 11,
        },
        {
            radius: [15, 17],
            count: 15,
        },
        {
            radius: [18, 20],
            count: 19,
        },
    ]
}

export { CloudsConfig };
