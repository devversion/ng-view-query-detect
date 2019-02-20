import {Component, ContentChild, Directive, NgModule, ViewChild} from '@angular/core';

@Component({
  selector: 'field',
  template:'<p>Field</p>'
})
export class SomeField {}

@Directive({
  selector: '[greet], ok',
  exportAs: 'test'
})
export class GreetDir {}

/* ------ */

@Component({
  selector: 'my-test',
  template: '<span greet #ok="test">Test</span>'
})
export class MyTest {
  @ViewChild(GreetDir) greet: GreetDir;
  @ViewChild('ok') usingLocalName: GreetDir;
  @ContentChild(SomeField) field: SomeField;
}

@Component({
  template: '<my-test><field></field></my-test>'
})
export class AppComp {}


@NgModule({declarations: [MyTest, GreetDir, SomeField, AppComp]})
export class AppModule {}
