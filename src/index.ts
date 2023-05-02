import * as GeoData from "./data/hksar_18_district_boundary.json"

const lat = 22.348637, long = 114.225366;

function isInside(lat: number, long: number, vs: number[][]): boolean {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];

        const intersect = ((yi > lat) != (yj > lat))
            && (long < (xj - xi) * (lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

async function main(): Promise<void> {
    const result = GeoData.features.map(e => {
        return {
            properties: {
                cityEn: e.properties.District,
                cityZh: e.properties.地區
            },
            isInside: isInside(lat, long, e.geometry.coordinates[0])
        }
    }).find(e => e.isInside)
    console.log(result?.properties.cityZh)
}

main()
    .then(() => {
        console.log('finished')
    }).catch((e) => {
        console.error(e)
    }
)