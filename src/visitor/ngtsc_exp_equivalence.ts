import {Expression, ExternalExpr, WrappedNodeExpr} from "@angular/compiler/";
import {TypeChecker} from "typescript";

/** Returns true if the given expressions refer to the same original symbol. */
export function isReferenceEqual(typeChecker: TypeChecker, exp1: Expression, exp2: Expression): boolean {
  if (exp1 instanceof WrappedNodeExpr && exp2 instanceof WrappedNodeExpr) {
    // Wrapped expressions can refer to different TypeScript identifiers, but the value
    // declaration may be equal. Manually compare the declarations of both expressions.
    return typeChecker.getSymbolAtLocation(exp1.node).valueDeclaration ===
           typeChecker.getSymbolAtLocation(exp2.node).valueDeclaration;
  }

  if (exp1 instanceof ExternalExpr && exp2 instanceof ExternalExpr) {
    return exp1.isEquivalent(exp2);
  }

  return false;
}
