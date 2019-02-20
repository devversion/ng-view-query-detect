import * as ast from "@angular/compiler/src/render3/r3_ast";
import * as outputAst from "@angular/compiler/src/output/output_ast";
import {R3QueryMetadata, SelectorMatcher} from "@angular/compiler";
import {createCssSelector} from "./create_css_selector";
import {getAttrsForDirectiveMatching} from "@angular/compiler/src/render3/view/util";
import {TypeChecker} from "typescript";
import {isReferenceEqual} from "./ngtsc_exp_equivalence";

export class TemplateVisitor implements ast.Visitor<void> {

  constructor(private directiveMatcher: SelectorMatcher,
              private typeChecker: TypeChecker,
              private contentQueries: R3QueryMetadata[],
              private viewQueries: R3QueryMetadata[]) {}

  visitAll(nodes: ast.Node[]) {ast.visitAll(this, nodes);}
  visitTemplate(template: ast.Template): void {this.visitAll(template.children);}
  visitBoundAttribute(attribute: ast.BoundAttribute): void {}
  visitBoundEvent(attribute: ast.BoundEvent): void {}
  visitBoundText(text: ast.BoundText): void {}
  visitContent(content: ast.Content): void {}
  visitIcu(icu: ast.Icu): void {}
  visitText(text: ast.Text): void {}
  visitTextAttribute(attribute: ast.TextAttribute): void {}
  visitVariable(variable: ast.Variable): void {}
  visitReference(reference: ast.Reference): void {}

  visitElement(element: ast.Element): void {
    const matchingDirectives = this._getMatchingDirectives(element);
    const matchingViewQueries = this._getMatchingViewQueries(element, matchingDirectives);

    // Print out queries targeting the given HTML node.
    console.log(element.name, matchingViewQueries.map(d => d.propertyName));

    this.visitAll(element.children);
  }

  /** Gets a set of matching directives for the given element. */
  private _getMatchingDirectives(element: ast.Element) {
    const attrs = getAttrsForDirectiveMatching(element);
    const selector = createCssSelector(element.name, attrs);
    const matchingDirectives: outputAst.Expression[] = [];

    this.directiveMatcher.match(selector, (cssSelector, staticType) => {
      matchingDirectives.push(staticType);
    });

    return matchingDirectives;
  }

  /** Gets all matching view queries for the given element. */
  private _getMatchingViewQueries(element: ast.Element, directives: outputAst.Expression[]) {
    return this.viewQueries.filter(query => {
      const predicate = query.predicate;

      if (predicate instanceof Array) {
        return predicate.some(localName =>
          element.references.some(ref => ref.name === localName));
      } else {
        return directives.some(d => isReferenceEqual(this.typeChecker, d, predicate));
      }
    })
  }
}
