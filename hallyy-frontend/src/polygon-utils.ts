export function calculatePolygonCenter(coordinates: number[][][]) {
    let area = 0;
    let x = 0;
    let y = 0;
    let points = coordinates[0];
    for (let i = 0; i < points.length - 1; i++) {
        let x1 = points[i][0];
        let y1 = points[i][1];
        let x2 = points[i + 1][0];
        let y2 = points[i + 1][1];
        let a = x1 * y2 - x2 * y1;
        area += a;
        x += (x1 + x2) * a;
        y += (y1 + y2) * a;
    }
    area /= 2;
    x /= 6 * area;
    y /= 6 * area;
    return [x, y];
}
