import { g, routers } from "@clientio/rappid";

function getOutsidePoint(bbox: any, angle: any, anchor: any, padding: any) {
    var ref = anchor.clone();
    var center = bbox.center();
    if (angle) ref.rotate(center, angle);
    var point = new g.Point(bbox.x, ref.y);
    if (point.equals(anchor)) {
        point.x--;
        padding--;
    }
    point.move(ref, (ref.x < center.x) ? padding : - bbox.width - padding);
    if (angle) point.rotate(center, -angle);
    return point.round();
}

routers.mapping = (vertices: any, opt: any, linkView: any) => {
    var link = linkView.model;
    var route = [];
    // Target Point
    var source = link.getSourceElement();
    if (source) {
        route.push(getOutsidePoint(
            source.getBBox(),
            source.angle(),
            linkView.sourceAnchor,
            opt.padding || opt.sourcePadding
        ));
    }
    // Vertices
    Array.prototype.push.apply(route, vertices);
    // Source Point
    var target = link.getTargetElement();
    if (target) {
        route.push(getOutsidePoint(
            target.getBBox(),
            target.angle(),
            linkView.targetAnchor,
            opt.padding || opt.targetPadding
        ));
    }
    return route;
}