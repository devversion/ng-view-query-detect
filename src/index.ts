import {NgtscProgram} from "@angular/compiler-cli/src/ngtsc/program";
import {createCompilerHost, readConfiguration} from "@angular/compiler-cli";
import {IvyCompilation} from "@angular/compiler-cli/src/ngtsc/transform";
import {Declaration} from "typescript"
import {IvyClass, MatchedHandler} from "./ngtsc-types";
import {ComponentDecoratorHandler} from "@angular/compiler-cli/src/ngtsc/annotations";
import {Decorator} from "@angular/compiler-cli/src/ngtsc/reflection";
import {ComponentHandlerData} from "@angular/compiler-cli/src/ngtsc/annotations/src/component";
import {CssSelector, SelectorMatcher} from "@angular/compiler";
import {TemplateVisitor} from "./visitor/template_visitor";

const config = readConfiguration(__dirname + '/../test-fixture/');
const host = createCompilerHost({options: config.options});
const program = new NgtscProgram(config.rootNames, config.options, host);
const typeChecker = program.getTsProgram().getTypeChecker();

// Ensure Program is analyzed.
program['ensureAnalyzed']();

// Retrieve Ivy compilation results. We use the compilation result in order
// to detect static or dynamic queries in the component templates.
const result: IvyCompilation = program['compilation'];
const ivyAnalyzedClasses: Map<Declaration, IvyClass> = result['ivyClasses'];

ivyAnalyzedClasses.forEach((ivyClass, tsDeclaration) => {
  const componentHandler: MatchedHandler<ComponentHandlerData, Decorator>|undefined =
    ivyClass.matchedHandlers.find(a => a.handler instanceof ComponentDecoratorHandler);

  // Do not handle Ivy compilation classes which are not components.
  if (!componentHandler) {
    return;
  }

  const meta = componentHandler.analyzed.analysis.meta;

  // Generate the CSS matcher that recognize directive
  const directiveMatcher = new SelectorMatcher();

  if (meta.directives.length > 0) {
    for (const {selector, expression} of meta.directives) {
      directiveMatcher.addSelectables(CssSelector.parse(selector), expression);
    }
  }

  const templateVisitor = new TemplateVisitor(directiveMatcher, typeChecker,
      meta.queries, meta.viewQueries);

  templateVisitor.visitAll(meta.template.nodes);
});
