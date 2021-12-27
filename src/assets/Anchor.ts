import { anchors, g } from "@clientio/rappid";


anchors.mapping = (view :any, magnet :any, ref :any)=> {
    var anchor;
    var model = view.model;
    var bbox = view.getNodeUnrotatedBBox(magnet);
    var center = model.getBBox().center();
    var angle = model.angle();
    var side = model.getItemSide(view.findAttribute('item-id', magnet));
    if (side === 'left') {
        anchor = bbox.leftMiddle();
    } else if (side === 'right') {
        anchor = bbox.rightMiddle();
    } else {
        var refPoint = ref;
        if (ref instanceof Element) {
        }
        anchor = (refPoint.x <= (bbox.x + bbox.width / 2)) ? bbox.leftMiddle() : bbox.rightMiddle();
    }
    return anchor.rotate(center, -angle);
};
