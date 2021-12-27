import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { dia, ui, shapes, util, setTheme, g, linkTools, connectionStrategies } from '@clientio/rappid';
import '../../assets/shapes'
import '../../assets/Anchor'
import '../../assets/Router'
import { DataMappingServiceService } from 'src/Service/data-mapping-service.service';


@Component({
  selector: 'app-data-mapping',
  templateUrl: './data-mapping.component.html',
  styleUrls: ['./data-mapping.component.scss']
})
export class DataMappingComponent implements OnInit, AfterViewInit {

  constructor(private dataMappingServiceService: DataMappingServiceService,) { }

  LoadGraphItems() {
    this.dataMappingServiceService.LoadGraphItems().subscribe(data => {
      this.graph.fromJSON(data);
    }
    );
  }

  @ViewChild('canvas') canvas: ElementRef;

  private graph: dia.Graph;
  private paper: dia.Paper;
  private scroller: ui.PaperScroller;


  ngOnInit(): void {

    setTheme('material');
    var toolbarHeight = 50;

    const graph = this.graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = this.paper = new dia.Paper({
      el: document.getElementById('paper')!,
      model: graph,
      width: 650,
      height: 650,
      gridSize: 10,
      background: { color: '#f6f6f6' },
      magnetThreshold: 'onleave',
      moveThreshold: 5,
      clickThreshold: 5,
      linkPinning: false,
      sorting: dia.Paper.sorting.APPROX,
      interactive: {
        linkMove: false,
        elementMove: false
      },
      cellViewNamespace: shapes,
      markAvailable: true,
      snapLinks: { radius: 40 },
      defaultRouter: {
        name: 'mapping',
        args: { padding: 30 }
      },
      defaultConnectionPoint: { name: 'anchor' },
      defaultAnchor: { name: 'mapping' },
      //   defaultConnector: {
      //     name: 'smooth',
      //     args: { jump: 'cubic' }
      // },
    });

    const scroller = this.scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: 'grab'
    });

    this.LoadGraphItems();

    var commandManager = new dia.CommandManager({
      graph: graph
    });

    commandManager.listen();

    var toolbar = new ui.Toolbar({
      autoToggle: true,
      references: {
        commandManager: commandManager
      }
    });

    toolbar.render();
    toolbar.el.style.height = toolbarHeight + 'px';
    document.body.appendChild(toolbar.el);

    // User Interactions

    paper.on('link:mouseenter', (linkView) => {
      paper.removeTools();
      this.showLinkTools(linkView);
    });

    paper.on('link:mouseleave', () => {
      paper.removeTools();
    });


    paper.on('element:contextmenu', (elementView, evt) => {
      var tools = elementView.model.getTools();
      if (tools) {
        evt.stopPropagation();
        this.elementActionPicker(elementView.el, elementView, tools);
      }
    });

    paper.on('element:magnet:contextmenu', (elementView, evt, magnet) => {
      var itemId = elementView.findAttribute('item-id', magnet);
      var tools = elementView.model.getItemTools(itemId, elementView);
      if (tools) {
        evt.stopPropagation();
        this.itemActionPicker(magnet, elementView, elementView.findAttribute('item-id', magnet), tools);
      }
    });

  }

  SourceArrowhead = linkTools.SourceArrowhead.extend({
    tagName: 'circle',
    attributes: {
      'cx': 3,
      'r': 10,
      'fill': 'transparent',
      'stroke': '#5755a1',
      'stroke-width': 2,
      'cursor': 'move',
      'class': 'target-arrowhead',
      'fill-opacity': 0.2
    }
  });

  TargetArrowhead = linkTools.TargetArrowhead.extend({
    tagName: 'circle',
    attributes: {
      'cx': -7,
      'r': 10,
      'fill': 'transparent',
      'stroke': '#5755a1',
      'stroke-width': 2,
      'cursor': 'move',
      'class': 'target-arrowhead',
      'fill-opacity': 0.2
    }
  });

  Remove = linkTools.Button.extend({
    children: [{
      tagName: 'circle',
      selector: 'button',
      attributes: {
        'r': 10,
        'fill': '#f6f6f6',
        'stroke': '#5755a1',
        'stroke-width': 2,
        'cursor': 'pointer'
      }
    }, {
      tagName: 'path',
      selector: 'icon',
      attributes: {
        'd': 'M -4 -4 4 4 M -4 4 4 -4',
        'fill': 'none',
        'stroke': '#5755a1',
        'stroke-width': 4,
        'pointer-events': 'none'
      }
    }]
  });

  // // Actions

  linkAction(link: any) {
    var dialog = new ui.Dialog({
      title: 'Confirmation',
      width: 300,
      content: 'Are you sure you want to delete this link?',
      buttons: [
        { action: 'cancel', content: 'Cancel' },
        { action: 'remove', content: '<span style="color:#fe854f">Remove</span>' }
      ]
    });

    dialog.open();
    dialog.on({
      'action:remove': () => {
        link.remove();
        dialog.remove();
      },
      'action:cancel': () => {
        dialog.remove();
      }
    });
  }

  showLinkTools(linkView: any) {
    var tools = new dia.ToolsView({
      tools: [
        new this.SourceArrowhead(),
        new this.TargetArrowhead(),
        new this.Remove({
          distance: '25%',
          action: () => {
            this.linkAction(linkView);
          }
        })
      ]
    });
    linkView.addTools(tools);
  }

  itemActionPicker(target: any, elementView: any, itemId: any, tools: any) {

    var element = elementView.model;
    var toolbar = new ui.ContextToolbar({
      target: target,
      padding: 5,
      vertical: true,
      tools: tools
    });

    toolbar.render();
    toolbar.on({
      'action:remove': () => {
        element.startBatch('item-remove');
        element.removeItem(itemId);
        element.removeInvalidLinks();
        element.stopBatch('item-remove');
        toolbar.remove();
      },
      'action:edit': () => {
        toolbar.remove();
        this.itemEditAction(element, itemId);
      },
      'action:add-child': () => {
        toolbar.remove();
        element.addItemAtIndex(itemId, Infinity, element.getDefaultItem());
        if (element.isItemCollapsed(itemId)) element.toggleItemCollapse(itemId);
      },
      'action:add-next-sibling': () => {
        toolbar.remove();
        element.addNextSibling(itemId, element.getDefaultItem());
      },
      'action:add-prev-sibling': () => {
        toolbar.remove();
        element.addPrevSibling(itemId, element.getDefaultItem());
      }
    });
  }

  elementActionPicker(target: any, elementView: any, tools: any) {

    var element = elementView.model
    var toolbar = new ui.ContextToolbar({
      target: target,
      padding: 5,
      vertical: true,
      tools: tools
    });

    toolbar.render();
    toolbar.on({
      'action:remove': () => {
        toolbar.remove();
        element.remove();
      },
      'action:add-item': () => {
        toolbar.remove();
        element.addItemAtIndex(0, Infinity, element.getDefaultItem(elementView));
      }
    });
  }

  itemEditAction(element: any, itemId: any) {

    var config = element.getInspectorConfig(itemId, element);
    if (!config) return;

    var inspector = new ui.Inspector({
      cell: element,
      live: false,
      inputs: util.setByPath({}, element.getItemPathArray(itemId), config)
    });

    inspector.render();
    inspector.el.style.position = 'relative';
    inspector.el.style.overflow = 'hidden';

    var dialog = new ui.Dialog({
      width: 300,
      title: 'Edit Item',
      closeButton: false,
      content: inspector.el,
      buttons: [{
        content: 'Cancel',
        action: 'cancel'
      }, {
        content: '<span style="color:#fe854f">Change</span>',
        action: 'change'
      }]
    });

    dialog.open();
    dialog.on({
      'action:cancel': () => {
        inspector.remove();
        dialog.close();
      },
      'action:change': () => {
        inspector.updateCell();
        inspector.remove();
        dialog.close();
      }
    });
  }


  ngAfterViewInit(): void {
    const { scroller, paper, canvas } = this;
    canvas.nativeElement.appendChild(this.scroller.el);
    scroller.center();
    paper.unfreeze();
  }

}
