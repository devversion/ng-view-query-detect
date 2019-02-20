import {
  AnalysisOutput,
  DecoratorHandler,
  DetectResult
} from "@angular/compiler-cli/src/ngtsc/transform";

/**
 * Record of an adapter which decided to emit a static field, and the analysis it performed to
 * prepare for that operation.
 */
export interface MatchedHandler<A, M> {
  handler: DecoratorHandler<A, M>;
  analyzed: AnalysisOutput<A>|null;
  detected: DetectResult<M>;
}

export interface IvyClass {
  matchedHandlers: MatchedHandler<any, any>[];

  hasWeakHandlers: boolean;
  hasPrimaryHandler: boolean;
}
