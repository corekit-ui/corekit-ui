/* eslint-disable @angular-eslint/component-max-inline-declarations */

import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  TemplateRef,
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { CkButton } from '@corekit/ui/button'
import { CkClose } from '@corekit/ui/close'
import {
  CK_DIALOG_DATA,
  CkDialog,
  CkDialogActions,
  CkDialogContent,
  CkDialogHeader,
  CkDialogRef,
  CkDialogSubtitle,
  CkDialogTitle,
} from '@corekit/ui/dialog'
import { CkFormField } from '@corekit/ui/form-field'
import { CkInput } from '@corekit/ui/input'
import { CkLabel } from '@corekit/ui/label'
import { CkP } from '@corekit/ui/typography'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'simple-dialog',
  imports: [
    CkDialogHeader,
    CkDialogTitle,
    CkDialogSubtitle,
    CkDialogContent,
    CkDialogActions,
    CkButton,
    CkClose,
  ],
  template: `
    <ck-dialog-header>
      <ck-dialog-title>Notifications</ck-dialog-title>
      <ck-dialog-subtitle>You have 3 unread messages.</ck-dialog-subtitle>

      <button
        type="button"
        ck-close
        ckCloseAppearance="icon"
        aria-label="Close"
        title="Close"
      ></button>
    </ck-dialog-header>

    <ck-dialog-content>
      <dl class="space-y-4">
        <div class="relative ps-5">
          <div
            class="absolute top-1.5 left-0 h-2 w-2 rounded-full bg-blue-500"
          ></div>
          <dt class="font-medium">Your call has been confirmed.</dt>
          <dd class="text-muted-foreground">1 hour ago</dd>
        </div>

        <div class="relative ps-5">
          <div
            class="absolute top-1.5 left-0 h-2 w-2 rounded-full bg-blue-500"
          ></div>
          <dt class="font-medium">You have a new message!</dt>
          <dd class="text-muted-foreground">1 hour ago</dd>
        </div>

        <div class="relative ps-5">
          <div
            class="absolute top-1.5 left-0 h-2 w-2 rounded-full bg-blue-500"
          ></div>
          <dt class="font-medium">Your subscription is expiring soon!</dt>
          <dd class="text-muted-foreground">2 hours ago</dd>
        </div>
      </dl>
    </ck-dialog-content>

    <ck-dialog-actions align="stretch">
      <button ckButton color="secondary" type="button" ck-close>Dismiss</button>
      <button ckButton type="button">👌 Mark all as read</button>
    </ck-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SimpleDialog {
  constructor(public readonly dialogRef: CkDialogRef) {}
}

@Component({
  selector: 'scrollable-dialog',
  imports: [
    CkDialogHeader,
    CkDialogTitle,
    CkDialogSubtitle,
    CkDialogContent,
    CkDialogActions,
    CkButton,
    CkP,
    CkClose,
  ],
  template: `
    <ck-dialog-header>
      <ck-dialog-title>Notifications</ck-dialog-title>
      <ck-dialog-subtitle>You have 3 unread messages.</ck-dialog-subtitle>

      <button
        type="button"
        ck-close
        ckCloseAppearance="icon"
        aria-label="Close"
        title="Close"
      ></button>
    </ck-dialog-header>

    <ck-dialog-content>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae at
        voluptatem recusandae ea quaerat soluta, odio cum amet? Minima suscipit
        voluptatum quasi nulla error pariatur minus dolorum obcaecati facilis
        voluptate?
      </p>
    </ck-dialog-content>

    <ck-dialog-actions align="stretch">
      <button ckButton color="secondary" type="button" ck-close>Dismiss</button>
      <button ckButton type="button">👌 Mark all as read</button>
    </ck-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ScrollableDialog {}

@Component({
  selector: 'dialog-with-injected-data',
  imports: [CkDialogHeader, CkDialogTitle, CkDialogContent, CkClose],
  template: `
    <ck-dialog-header>
      <ck-dialog-title>Dialog with injected data</ck-dialog-title>

      <button
        type="button"
        ck-close
        ckCloseAppearance="icon"
        aria-label="Close"
        title="Close"
      ></button>
    </ck-dialog-header>

    <ck-dialog-content>Hello, {{ data }}!</ck-dialog-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DialogWithPassedData {
  constructor(@Inject(CK_DIALOG_DATA) public readonly data: string) {}
}

@Component({
  selector: 'dialog-with-output-data',
  imports: [
    ReactiveFormsModule,
    CkButton,
    CkFormField,
    CkInput,
    CkDialogHeader,
    CkDialogTitle,
    CkDialogContent,
    CkDialogActions,
    CkLabel,
    CkClose,
  ],
  template: `
    <ck-dialog-header>
      <ck-dialog-title>Dialog with output data</ck-dialog-title>

      <button
        type="button"
        ck-close
        ckCloseAppearance="icon"
        aria-label="Close"
        title="Close"
      ></button>
    </ck-dialog-header>

    <ck-dialog-content>
      <ck-form-field>
        <label ckLabel for="email2">What's your name?</label>

        <input
          id="email2"
          type="email"
          ckInput
          placeholder="John Doe"
          [formControl]="nameControl"
          (keydown.enter)="dialogRef.close(nameControl.value)"
        />
      </ck-form-field>
    </ck-dialog-content>

    <ck-dialog-actions class="!m-0">
      <button ckButton type="button" [ck-close]="nameControl.value">
        Submit
      </button>
    </ck-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DialogWithOutputData {
  public readonly nameControl = new FormControl()

  constructor(
    @Inject(CK_DIALOG_DATA)
    public readonly data: string,
    public readonly dialogRef: CkDialogRef,
  ) {}
}

@Component({
  selector: 'app-dialog-page',
  imports: [
    CkDialogHeader,
    CkDialogTitle,
    CkDialogSubtitle,
    CkDialogContent,
    CkDialogActions,
    CkButton,
    CkClose,
  ],
  templateUrl: './dialog-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block space-y-1 space-x-3' },
})
export class DialogPageComponent {
  constructor(private readonly _dialog: CkDialog) {}

  public openDialog(): void {
    this._dialog.open(SimpleDialog)
  }

  public openDialogWithTemplate(template: TemplateRef<unknown>): void {
    this._dialog.open(template)
  }

  public openScrollableDialog(): void {
    this._dialog.open(ScrollableDialog)
  }

  public openDialogWithPassedData(): void {
    const name = prompt(`What's your name?`)

    this._dialog.open(DialogWithPassedData, {
      data: name || 'Mr. Bond',
    })
  }

  public async openDialogWithOutputData(): Promise<void> {
    const dialog = this._dialog.open<string>(DialogWithOutputData)

    const name = await firstValueFrom(dialog.afterClosed)

    alert(name ? `Hello, ${name}!` : 'Hello, Mr. Bond')
  }
}
