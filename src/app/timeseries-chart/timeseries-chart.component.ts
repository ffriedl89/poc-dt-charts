import {
  Component, Input, ElementRef, AfterViewInit, ViewChild, Renderer2,
} from '@angular/core';
import { scaleLinear, ScaleLinear, } from 'd3-scale';
import { max } from 'd3-array';
import { select, Selection } from 'd3-selection';
import { axisLeft } from 'd3-axis';


export interface DtSeries {
  name: string;
  data: Array<[number, number]>;
}

export interface DtAxisOptions {
  ticks: number;
  min?: number;
  max?: number;
}

export interface DtOptions {
  xAxis: DtAxisOptions;
  yAxis: DtAxisOptions | DtAxisOptions[];
}

const CHART_HEIGHT = 250;
const CHART_MARGIN = 14;

@Component({
  selector: 'dt-timeseries-chart',
  templateUrl: './timeseries-chart.component.html',
  styleUrls: ['./timeseries-chart.component.scss'],
})
export class DtTimeseriesChartComponent implements AfterViewInit {
  @ViewChild('chart') chart: ElementRef;

  @Input() series: DtSeries[];

  @Input() options: DtOptions;

  private _yScaleLeft: ScaleLinear<number, number>;

  private _chartSelection: Selection<SVGElement, {}, HTMLElement, any>;

  _width: number;

  _height = CHART_HEIGHT;

  get _plotHeight() { return this._height - CHART_MARGIN * 2; }

  get _viewbox() { return this._width && `0 0 ${this._width} ${this._height}`; }

  constructor(private _ref: ElementRef, private _renderer: Renderer2) {}

  ngAfterViewInit(): void {
    setTimeout(() => { this._width = this._ref.nativeElement.getBoundingClientRect().width; });
    this._chartSelection = select<SVGElement, {}>(this.chart.nativeElement);

    const bar = this._chartSelection.selectAll('g')
        .data(this.series[0].data)
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(${i * 10},${CHART_MARGIN})`);

    this._createAxis();

    bar.append('rect')
        .attr('height', (d) => this._yScaleLeft(d[1]))
        .attr('y', (d) => this._plotHeight - this._yScaleLeft(d[1]))
        .attr('width', 10)
        .attr('fill', '#7c38a1');
  }

  private _createAxis(): void {
    const hasTwoYAxis = Array.isArray(this.options.yAxis);

    const yAxisLeftOptions: DtAxisOptions = hasTwoYAxis ? this.options.yAxis[0] : this.options.yAxis;

    // yAxis left
    const yScale = yAxisLeftOptions.max !== undefined ?
      scaleLinear().domain([yAxisLeftOptions.max, 0]) :
      scaleLinear().domain([max(this.series[0].data.map((d) => d[1])), 0]).nice();

    this._yScaleLeft = yScale.range([0, this._plotHeight]);

    const yAxis = axisLeft(this._yScaleLeft)
      .ticks(yAxisLeftOptions.ticks);

    this._chartSelection.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(40,${CHART_MARGIN})`)
      .call(yAxis);

    getTextNodeWidth(this._renderer, this._ref.nativeElement, 'some very long text');

  }
}

function getTextNodeWidth(renderer: Renderer2, parent: any, text: string): number {
  const svgNode: SVGElement = renderer.createElement('svg', 'svg');
  svgNode.setAttribute('class', 'visuallyhidden');
  const textNode = renderer.createElement('text', 'svg');
  svgNode.appendChild(textNode);
  textNode.appendChild(renderer.createText(text));
  renderer.appendChild(parent, svgNode);
  renderer.removeChild(parent, svgNode);
  return textNode.getBBox().width;
}
