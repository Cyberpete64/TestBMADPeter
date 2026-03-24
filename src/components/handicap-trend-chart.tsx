import Link from "next/link";

import type { PersistedRound } from "@/lib/round-domain";

type HandicapTrendChartProps = {
  rounds: PersistedRound[];
};

type TrendPoint = {
  id: string;
  playedOn: string;
  handicap: number;
};

const CHART_WIDTH = 720;
const CHART_HEIGHT = 220;
const CHART_PADDING_X = 28;
const CHART_PADDING_TOP = 24;
const CHART_PADDING_BOTTOM = 38;

function formatHandicap(value: number) {
  return value.toFixed(1);
}

function sortRoundsForTrend(rounds: PersistedRound[]): TrendPoint[] {
  return [...rounds]
    .sort((left, right) => {
      if (left.playedOn === right.playedOn) {
        return left.createdAt.localeCompare(right.createdAt);
      }

      return left.playedOn.localeCompare(right.playedOn);
    })
    .map((round) => ({
      id: round.id,
      playedOn: round.playedOn,
      handicap: round.enteredHandicap,
    }));
}

export function HandicapTrendChart({ rounds }: HandicapTrendChartProps) {
  if (rounds.length === 0) {
    return (
      <section className="page-card">
        <div className="detail-card__header">
          <div>
            <span className="pill">Handicap trend</span>
            <h2>Progress appears after your first saved round.</h2>
            <p className="muted">
              Save rounds and the dashboard will chart the handicap value you
              entered over time.
            </p>
          </div>
          <Link className="button-secondary" href="/rounds/new">
            Start a New Round
          </Link>
        </div>
      </section>
    );
  }

  const trend = sortRoundsForTrend(rounds);
  const handicaps = trend.map((point) => point.handicap);
  const minimumHandicap = Math.min(...handicaps);
  const maximumHandicap = Math.max(...handicaps);
  const handicapSpread = maximumHandicap - minimumHandicap || 1;
  const chartInnerWidth = CHART_WIDTH - CHART_PADDING_X * 2;
  const chartInnerHeight =
    CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

  const points = trend.map((point, index) => {
    const x =
      trend.length === 1
        ? CHART_WIDTH / 2
        : CHART_PADDING_X + (chartInnerWidth * index) / (trend.length - 1);
    const normalizedY =
      (point.handicap - minimumHandicap) / handicapSpread;
    const y = CHART_PADDING_TOP + chartInnerHeight - normalizedY * chartInnerHeight;

    return {
      ...point,
      x,
      y,
    };
  });

  const pathDefinition = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
    )
    .join(" ");

  const latestPoint = trend[trend.length - 1];
  const firstPoint = trend[0];
  const handicapChange = latestPoint.handicap - firstPoint.handicap;
  const roundedChange =
    handicapChange === 0 ? "0.0" : `${handicapChange > 0 ? "+" : ""}${handicapChange.toFixed(1)}`;
  const titleId = "handicap-trend-chart-title";
  const descriptionId = "handicap-trend-chart-description";

  return (
    <section className="page-card">
      <div className="detail-card__header">
        <div>
          <span className="pill">Handicap trend</span>
          <h2>Entered handicap over time</h2>
          <p className="muted">
            This tracks the handicap value saved on each round. Lower values
            trend in the right direction.
          </p>
        </div>
        <div className="trend-summary">
          <div>
            <div className="stat-label">First</div>
            <strong>{formatHandicap(firstPoint.handicap)}</strong>
          </div>
          <div>
            <div className="stat-label">Latest</div>
            <strong>{formatHandicap(latestPoint.handicap)}</strong>
          </div>
          <div>
            <div className="stat-label">Change</div>
            <strong>{roundedChange}</strong>
          </div>
        </div>
      </div>

      <div className="trend-chart">
        <svg
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          className="trend-chart__svg"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
        >
          <title id={titleId}>Entered handicap trend over time</title>
          <desc id={descriptionId}>
            {`Handicap values from ${firstPoint.playedOn} to ${latestPoint.playedOn}. First ${formatHandicap(firstPoint.handicap)}, latest ${formatHandicap(latestPoint.handicap)}, change ${roundedChange}.`}
          </desc>
          <line
            className="trend-chart__axis"
            x1={CHART_PADDING_X}
            x2={CHART_WIDTH - CHART_PADDING_X}
            y1={CHART_HEIGHT - CHART_PADDING_BOTTOM}
            y2={CHART_HEIGHT - CHART_PADDING_BOTTOM}
          />
          <line
            className="trend-chart__axis"
            x1={CHART_PADDING_X}
            x2={CHART_PADDING_X}
            y1={CHART_PADDING_TOP}
            y2={CHART_HEIGHT - CHART_PADDING_BOTTOM}
          />
          {points.map((point) => (
            <line
              className="trend-chart__grid"
              key={`grid-${point.id}`}
              x1={point.x}
              x2={point.x}
              y1={CHART_PADDING_TOP}
              y2={CHART_HEIGHT - CHART_PADDING_BOTTOM}
            />
          ))}
          <path className="trend-chart__line" d={pathDefinition} />
          {points.map((point) => (
            <g key={point.id}>
              <circle
                className="trend-chart__point"
                cx={point.x}
                cy={point.y}
                r="5"
              />
              <text
                className="trend-chart__value"
                textAnchor="middle"
                x={point.x}
                y={point.y - 12}
              >
                {formatHandicap(point.handicap)}
              </text>
              <text
                className="trend-chart__label"
                textAnchor="middle"
                x={point.x}
                y={CHART_HEIGHT - 12}
              >
                {point.playedOn}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="sr-only">
        {trend.map((point) => (
          <li key={`trend-summary-${point.id}`}>
            {point.playedOn}: handicap {formatHandicap(point.handicap)}
          </li>
        ))}
      </ol>
    </section>
  );
}
