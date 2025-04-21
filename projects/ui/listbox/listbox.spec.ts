/* eslint-disable space-before-function-paren */
/* eslint-disable max-statements */
/* eslint-disable @angular-eslint/component-max-inline-declarations */
/* eslint-disable id-length */
/* eslint-disable @angular-eslint/use-component-selector */
import { ChangeDetectionStrategy, Component, signal, Type } from '@angular/core'
import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { FormControl, ReactiveFormsModule } from '@angular/forms'

import { CkListbox, ListboxValueChangeEvent } from './listbox'
import { CkOption } from '../option'
import { dispatchKeyboardEvent, dispatchMouseEvent } from '../testing'
import {
  DOWN_ARROW,
  END,
  HOME,
  SPACE,
  UP_ARROW,
  V,
} from '@angular/cdk/keycodes'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function setupComponent<T, O = string>(
  component: Type<T>,
  imports: unknown[] = [],
) {
  TestBed.configureTestingModule({
    imports: [CkListbox, CkOption, ...imports],
    declarations: [component],
  })

  const fixture = TestBed.createComponent(component)

  fixture.detectChanges()

  const listboxDebugEl = fixture.debugElement.query(By.directive(CkListbox))
  const optionDebugEls = fixture.debugElement.queryAll(By.directive(CkOption))

  return {
    fixture,
    testComponent: fixture.componentInstance,
    listbox: listboxDebugEl.injector.get<CkListbox<O>>(CkListbox),
    listboxEl: listboxDebugEl.nativeElement as HTMLElement,
    options: optionDebugEls.map(el => el.injector.get<CkOption<O>>(CkOption)),
    optionEls: optionDebugEls.map(el => el.nativeElement as HTMLElement),
  }
}

describe('ListboxComponent', () => {
  it('should generate unique id', () => {
    const { listbox, listboxEl } = setupComponent(ListboxWithOptions)

    expect(listbox.id()).toEqual(listboxEl.id)
    expect(listbox.id()).toMatch(/ck-listbox-\w+/u)
  })

  it('should not overwrite user given id', () => {
    const { testComponent, fixture, listboxEl } = setupComponent(ListboxWithId)

    testComponent.id.set('my-id')
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()
    expect(listboxEl.id).toBe('my-id')
  })

  it('should be empty initially', () => {
    const { fixture, listbox, options, optionEls } =
      setupComponent(ListboxWithOptions)

    expect(listbox.value).toEqual([])

    for (let i = 0; i < options.length; i++) {
      expect(options[i].isSelected()).toBeFalse()
      expect(optionEls[i].getAttribute('aria-selected')).toBe('false')
    }
    expect(fixture.componentInstance.changedOption).toBeUndefined()
  })

  describe('with tabindex', () => {
    it('should use tabindex=0 for focusable elements, tabindex=-1 for non-focusable elements', () => {
      const { fixture, listbox, listboxEl, optionEls } =
        setupComponent(ListboxWithOptions)

      expect(listboxEl.getAttribute('tabindex')).toBe('0')
      expect(optionEls[0].getAttribute('tabindex')).toBe('-1')

      listbox.focus()
      fixture.detectChanges()

      expect(listboxEl.getAttribute('tabindex')).toBe('-1')
      expect(optionEls[0].getAttribute('tabindex')).toBe('0')
    })

    it('should reset the tabindex if the active option is destroyed', () => {
      const { fixture, listbox, listboxEl } =
        setupComponent(ListboxWithMolOption)

      fixture.componentInstance.molRender.set(true)
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()

      let options = (fixture.nativeElement as HTMLElement).querySelectorAll(
        'ck-option',
      )

      expect(listboxEl.getAttribute('tabindex')).toBe('0')
      expect(options[0].getAttribute('tabindex')).toBe('-1')

      listbox.focus()
      fixture.detectChanges()

      expect(listboxEl.getAttribute('tabindex')).toBe('-1')
      expect(options[0].getAttribute('tabindex')).toBe('0')

      fixture.componentInstance.molRender.set(false)
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()
      options = (fixture.nativeElement as HTMLElement).querySelectorAll(
        'ck-option',
      )

      expect(listboxEl.getAttribute('tabindex')).toBe('0')
      expect(options[0].getAttribute('tabindex')).toBe('-1')
    })
  })

  it('should update when selection is changed programmatically', () => {
    const { fixture, listbox, options, optionEls } =
      setupComponent(ListboxWithOptions)

    options[1].select()
    fixture.detectChanges()

    expect(listbox.value).toEqual(['react'])
    expect(options[1].isSelected()).toBeTrue()
    expect(optionEls[1].getAttribute('aria-selected')).toBe('true')
  })

  it('should update when option clicked', () => {
    const { fixture, listbox, options, optionEls } =
      setupComponent(ListboxWithOptions)

    optionEls[0].click()
    fixture.detectChanges()

    expect(listbox.value).toEqual(['angular'])
    expect(options[0].isSelected()).toBeTrue()
    expect(optionEls[0].getAttribute('aria-selected')).toBe('true')
    expect(fixture.componentInstance.changedOption?.id()).toBe(options[0].id())
  })

  // it('should select and deselect range on option SHIFT + click', () => {})

  it('should update on option activated via keyboard', () => {
    const { fixture, listbox, options, optionEls } =
      setupComponent(ListboxWithOptions)

    listbox.focus()
    dispatchKeyboardEvent(optionEls[0], 'keydown', SPACE)
    fixture.detectChanges()

    expect(listbox.value).toEqual(['angular'])
    expect(options[0].isSelected()).toBeTrue()
    expect(optionEls[0].getAttribute('aria-selected')).toBe('true')
    expect(fixture.componentInstance.changedOption?.id()).toBe(options[0].id())
  })

  describe('with single-selection', () => {
    it('should deselect previously selected option', () => {
      const { fixture, listbox, options, optionEls } =
        setupComponent(ListboxWithOptions)

      dispatchMouseEvent(optionEls[0], 'click')
      fixture.detectChanges()

      expect(listbox.value).toEqual(['angular'])
      expect(options[0].isSelected()).toBeTrue()

      dispatchMouseEvent(optionEls[2], 'click')
      fixture.detectChanges()

      expect(listbox.value).toEqual(['vue'])
      expect(options[0].isSelected()).toBeFalse()
    })

    it('should keep the same selection state if already selected option clicked', () => {
      const { testComponent, fixture, listbox, options, optionEls } =
        setupComponent(ListboxWithOptions)

      testComponent.value.set(['angular'])
      fixture.detectChanges()

      expect(listbox.value).toEqual(['angular'])
      expect(options[0].isSelected()).toBeTrue()

      dispatchMouseEvent(optionEls[0], 'click')
      fixture.detectChanges()

      expect(listbox.value).toEqual(['angular'])
      expect(options[0].isSelected()).toBeTrue()
      expect(testComponent.changedOption).toBeUndefined()
    })
  })

  describe('with multiple selection', () => {
    it('should add to selection', () => {
      const { testComponent, fixture, listbox, options, optionEls } =
        setupComponent(ListboxWithOptions)

      testComponent.multiple.set(true)
      fixture.changeDetectorRef.markForCheck()
      optionEls[0].click()
      fixture.detectChanges()

      expect(listbox.value).toEqual(['angular'])
      expect(options[0].isSelected()).toBeTrue()

      optionEls[2].click()
      fixture.detectChanges()

      expect(listbox.value).toEqual(['angular', 'vue'])
      expect(options[0].isSelected()).toBeTrue()
    })

    it('should select all options programmatically', () => {
      const { testComponent, fixture, listbox } =
        setupComponent(ListboxWithOptions)

      testComponent.multiple.set(true)
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()

      listbox.selectAll()
      fixture.detectChanges()

      expect(listbox.value).toEqual([
        'angular',
        'react',
        'vue',
        'svelte',
        'solid',
      ])
    })

    it('should deselect all options programmatically', () => {
      const { testComponent, fixture, listbox } =
        setupComponent(ListboxWithOptions)

      testComponent.multiple.set(true)
      testComponent.value.set(['angular', 'react'])
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()

      expect(listbox.value).toEqual(['angular', 'react'])

      listbox.deselectAll()
      fixture.detectChanges()

      expect(listbox.value).toEqual([])
    })
  })

  it('should deselect all options when switching to single-selection with invalid selection', () => {
    const { testComponent, fixture, listbox, optionEls } =
      setupComponent(ListboxWithOptions)

    testComponent.multiple.set(true)
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()
    optionEls[0].click()
    fixture.detectChanges()
    optionEls[1].click()
    fixture.detectChanges()

    expect(listbox.value).toEqual(['angular', 'react'])

    testComponent.multiple.set(false)
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()

    expect(listbox.value).toEqual([])
  })

  it('should preserve selection when switching to single-selection with valid selection', () => {
    const { testComponent, fixture, listbox, optionEls } =
      setupComponent(ListboxWithOptions)

    testComponent.multiple.set(true)
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()
    optionEls[0].click()
    fixture.detectChanges()

    expect(listbox.value).toEqual(['angular'])

    testComponent.multiple.set(false)
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()

    expect(listbox.value).toEqual(['angular'])
  })

  it('should allow programmatically toggling options', () => {
    const { testComponent, fixture, listbox, options } =
      setupComponent(ListboxWithOptions)

    testComponent.multiple.set(true)
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()

    options[0].toggle()
    listbox.toggle(options[1])
    fixture.detectChanges()

    expect(options[0].isSelected()).toBeTrue()
    expect(options[1].isSelected()).toBeTrue()

    options[0].toggle()
    listbox.toggle(options[1])
    fixture.detectChanges()

    expect(options[0].isSelected()).toBeFalse()
    expect(options[1].isSelected()).toBeFalse()
  })

  it('should allow programmatically selecting and deselecting options', () => {
    const { testComponent, fixture, listbox, options } =
      setupComponent(ListboxWithOptions)

    testComponent.multiple.set(true)
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()

    options[0].select()
    listbox.select(options[1])
    fixture.detectChanges()

    expect(options[0].isSelected()).toBeTrue()
    expect(options[1].isSelected()).toBeTrue()

    options[0].deselect()
    listbox.deselect(options[1])
    fixture.detectChanges()

    expect(options[0].isSelected()).toBeFalse()
    expect(options[1].isSelected()).toBeFalse()
  })

  it('should allow binding to listbox value', () => {
    const { testComponent, fixture, listbox, options } = setupComponent(
      ListboxWithBoundValue,
    )

    expect(listbox.value).toEqual(['react'])
    expect(options[1].isSelected()).toBeTrue()

    testComponent.value.set(['vue'])
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()

    expect(listbox.value).toEqual(['vue'])
    expect(options[2].isSelected()).toBeTrue()
  })

  it('should handle multiple preselected values', async () => {
    const { testComponent, fixture, listbox, options } = setupComponent(
      ListboxWithMultipleBoundValues,
    )

    await fixture.whenStable()
    expect(listbox.value).toEqual(['react', 'vue'])
    expect(options.map(o => o.isSelected())).toEqual([false, true, true, false])

    testComponent.value.set(['angular', 'svelte'])
    fixture.changeDetectorRef.markForCheck()
    fixture.detectChanges()

    expect(listbox.value).toEqual(['angular', 'svelte'])
    expect(options.map(o => o.isSelected())).toEqual([true, false, false, true])
  })

  it('should allow to select option with value `null`', async () => {
    const { fixture, listbox, options, optionEls } = setupComponent<
      ListboxWithNullOption,
      string | null
    >(ListboxWithNullOption)

    await fixture.whenStable()
    fixture.changeDetectorRef.markForCheck()
    optionEls[1].click()
    fixture.detectChanges()

    expect(listbox.value).toEqual(['angular'])
    expect(options[1].isSelected()).toBeTrue()

    optionEls[0].click()
    fixture.detectChanges()

    expect(listbox.value).toEqual([null])
    expect(options[0].isSelected()).toBeTrue()
    expect(fixture.componentInstance.eventValue).toEqual([null])
  })

  describe('with disabled', () => {
    it('should be able to toggle listbox disabled state', () => {
      const { fixture, testComponent, listbox, listboxEl, options, optionEls } =
        setupComponent(ListboxWithOptions)

      testComponent.disabled.set(true)
      fixture.detectChanges()

      expect(listbox.disabled()).toBeTrue()
      expect(listboxEl.getAttribute('aria-disabled')).toBe('true')

      for (let i = 0; i < options.length; i++) {
        expect(options[i]._parentDisabled()).toBeTrue()
        expect(optionEls[i].getAttribute('aria-disabled')).toBe('true')
      }
    })

    it('should not change selection on click', () => {
      const { fixture, testComponent, listbox, optionEls } =
        setupComponent(ListboxWithOptions)

      testComponent.isSvetleDisabled.set(true)
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()

      optionEls[3].click()
      fixture.detectChanges()

      expect(listbox.value).toEqual([])
      expect(fixture.componentInstance.changedOption).toBeUndefined()
    })

    it('should not change selection on keyboard activation', () => {
      const { fixture, testComponent, listbox, listboxEl } =
        setupComponent(ListboxWithOptions)

      listbox.focus()
      fixture.detectChanges()

      testComponent.disabled.set(true)
      fixture.detectChanges()

      dispatchKeyboardEvent(listboxEl, 'keydown', SPACE)
      fixture.detectChanges()

      expect(listbox.value).toEqual([])
      expect(fixture.componentInstance.changedOption).toBeUndefined()
    })

    it('should not handle type ahead', fakeAsync(() => {
      const { fixture, testComponent, listboxEl, options } =
        setupComponent(ListboxWithOptions)

      testComponent.disabled.set(true)
      fixture.detectChanges()

      dispatchKeyboardEvent(listboxEl, 'keydown', V)
      fixture.detectChanges()
      tick(200)

      for (const option of options) {
        expect(option.isActive()).toBeFalse()
      }
    }))

    it('should skip disabled options when navigating with arrow keys', () => {
      const { testComponent, fixture, listbox, listboxEl, options } =
        setupComponent(ListboxWithOptions)

      testComponent.isSvetleDisabled.set(true)
      fixture.changeDetectorRef.markForCheck()
      listbox.focus()
      fixture.detectChanges()

      expect(options[0].isActive()).toBeTrue()

      dispatchKeyboardEvent(listboxEl, 'keydown', DOWN_ARROW)
      dispatchKeyboardEvent(listboxEl, 'keydown', DOWN_ARROW)
      dispatchKeyboardEvent(listboxEl, 'keydown', DOWN_ARROW)
      dispatchKeyboardEvent(listboxEl, 'keydown', DOWN_ARROW)
      fixture.detectChanges()

      expect(options[4].isActive()).toBeTrue()
    })
  })

  describe('compare with', () => {
    it('should allow custom function to compare option values', () => {
      const { fixture, listbox, options } = setupComponent<
        ListboxWithObjectValues,
        { name: string }
      >(ListboxWithObjectValues)

      listbox.value = [{ name: 'vue' }]
      fixture.detectChanges()

      expect(options[2].isSelected()).toBeTrue()

      listbox.value = [{ name: 'react' }]
      fixture.detectChanges()

      expect(options[1].isSelected()).toBeTrue()
    })
  })

  describe('keyboard navigation', () => {
    it('should update active item on arrow key presses', () => {
      const { fixture, listbox, listboxEl, options } =
        setupComponent(ListboxWithOptions)

      listbox.focus()
      dispatchKeyboardEvent(listboxEl, 'keydown', DOWN_ARROW)
      fixture.detectChanges()

      expect(options[1].isActive()).toBeTrue()

      dispatchKeyboardEvent(listboxEl, 'keydown', UP_ARROW)
      fixture.detectChanges()

      expect(options[0].isActive()).toBeTrue()
    })

    it('should update active option on home and end key press', () => {
      const { fixture, listbox, listboxEl, options } =
        setupComponent(ListboxWithOptions)

      listbox.focus()
      dispatchKeyboardEvent(listboxEl, 'keydown', END)
      fixture.detectChanges()

      expect(options[options.length - 1].isActive()).toBeTrue()

      dispatchKeyboardEvent(listboxEl, 'keydown', HOME)
      fixture.detectChanges()

      expect(options[0].isActive()).toBeTrue()
    })

    xit('should change active item using type ahead', fakeAsync(() => {
      const { fixture, listbox, listboxEl, options } =
        setupComponent(ListboxWithOptions)

      listbox.focus()
      fixture.detectChanges()

      dispatchKeyboardEvent(listboxEl, 'keydown', 118)
      fixture.detectChanges()
      tick(200)

      expect(options[2].isActive()).toBeTrue()
    }))

    it('should focus the selected option when the listbox is focused', () => {
      const { testComponent, fixture, listbox, listboxEl, options } =
        setupComponent(ListboxWithOptions)

      testComponent.value.set('solid')
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()
      listbox.focus()
      fixture.detectChanges()

      expect(options[4].isActive()).toBeTrue()

      dispatchKeyboardEvent(listboxEl, 'keydown', UP_ARROW)
      fixture.detectChanges()

      expect(options[3].isActive()).toBeTrue()
    })

    it('should not move focus to the selected option while the user is navigating', () => {
      const { testComponent, fixture, listbox, listboxEl, options } =
        setupComponent(ListboxWithOptions)

      listbox.focus()
      fixture.detectChanges()
      expect(options[0].isActive()).toBeTrue()

      dispatchKeyboardEvent(listboxEl, 'keydown', DOWN_ARROW)
      fixture.detectChanges()
      expect(options[1].isActive()).toBeTrue()

      testComponent.value.set('solid')
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()
      expect(options[1].isActive()).toBeTrue()
    })
  })

  describe('with roving tabindex', () => {
    it('should shift focus on keyboard navigation', () => {
      const { fixture, listbox, listboxEl, optionEls } =
        setupComponent(ListboxWithOptions)

      listbox.focus()
      fixture.detectChanges()

      expect(document.activeElement).toEqual(optionEls[0])
      expect(listboxEl.hasAttribute('aria-activedescendant')).toBeTrue()

      dispatchKeyboardEvent(listboxEl, 'keydown', DOWN_ARROW)
      fixture.detectChanges()

      expect(document.activeElement).toEqual(optionEls[1])
      expect(listboxEl.hasAttribute('aria-activedescendant')).toBeTrue()
    })

    it('should focus first option on listbox focus', () => {
      const { fixture, listbox, optionEls } = setupComponent(ListboxWithOptions)

      listbox.focus()
      fixture.detectChanges()

      expect(document.activeElement).toEqual(optionEls[0])
    })

    it('should focus listbox if no focusable options available', () => {
      const { fixture, listbox, listboxEl } =
        setupComponent(ListboxWithNoOptions)

      listbox.focus()
      fixture.detectChanges()

      expect(document.activeElement).toBe(listboxEl)
    })
  })

  describe('with FormControl', () => {
    it('should reflect disabled state of the FormControl', () => {
      const { testComponent, fixture, listboxEl } = setupComponent(
        ListboxWithFormControl,
        [ReactiveFormsModule],
      )

      testComponent.formControl.disable()
      fixture.detectChanges()

      expect(listboxEl.getAttribute('aria-disabled')).toBe('true')
    })

    it('should update when FormControl value changes', () => {
      const { testComponent, fixture, options } = setupComponent(
        ListboxWithFormControl,
        [ReactiveFormsModule],
      )

      testComponent.formControl.setValue(['angular'])
      fixture.detectChanges()

      expect(options[0].isSelected()).toBeTrue()
    })

    it('should update FormControl when selection changes', () => {
      const { testComponent, fixture, optionEls } = setupComponent(
        ListboxWithFormControl,
        [ReactiveFormsModule],
      )
      const spy = jasmine.createSpy()
      const subscription = testComponent.formControl.valueChanges.subscribe(spy)

      fixture.detectChanges()

      expect(spy).not.toHaveBeenCalled()

      optionEls[1].click()
      fixture.detectChanges()

      expect(spy).toHaveBeenCalledWith(['react'])
      subscription.unsubscribe()
    })

    it('should update multi-select listbox when FormControl value changes', () => {
      const { testComponent, fixture, options } = setupComponent(
        ListboxWithFormControl,
        [ReactiveFormsModule],
      )

      testComponent.multiple.set(true)
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()
      testComponent.formControl.setValue(['react', 'vue'])
      fixture.detectChanges()

      expect(options[1].isSelected()).toBeTrue()
      expect(options[2].isSelected()).toBeTrue()
    })

    it('should update FormControl when multi-selection listbox changes', () => {
      const { testComponent, fixture, optionEls } = setupComponent(
        ListboxWithFormControl,
        [ReactiveFormsModule],
      )

      testComponent.multiple.set(true)
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()

      const spy = jasmine.createSpy()
      const subscription = testComponent.formControl.valueChanges.subscribe(spy)

      fixture.detectChanges()

      expect(spy).not.toHaveBeenCalled()

      optionEls[1].click()
      fixture.detectChanges()
      expect(spy).toHaveBeenCalledWith(['react'])

      optionEls[2].click()
      fixture.detectChanges()
      expect(spy).toHaveBeenCalledWith(['react', 'vue'])
      subscription.unsubscribe()
    })

    it('should throw when multiple values selected in single-select listbox', () => {
      const { testComponent, fixture } = setupComponent(
        ListboxWithFormControl,
        [ReactiveFormsModule],
      )

      expect(() => {
        testComponent.formControl.setValue(['angular', 'react'])
        fixture.detectChanges()
      }).toThrowError(
        'Listbox cannot have more than one selected value in single-selection mode.',
      )
    })

    it('should throw when an invalid value is selected', () => {
      const { testComponent, fixture } = setupComponent(
        ListboxWithFormControl,
        [ReactiveFormsModule],
      )

      testComponent.multiple.set(true)
      fixture.changeDetectorRef.markForCheck()
      fixture.detectChanges()

      expect(() => {
        testComponent.formControl.setValue(['angular', 'react', '$mol'])
        fixture.detectChanges()
      }).toThrowError(
        'Listbox has selected values that do not match any of its options.',
      )
    })

    it('should not throw on init with a preselected form control and a dynamic set of options', () => {
      expect(() => {
        setupComponent(ListboxWithPreselectedFormControl, [ReactiveFormsModule])
      }).not.toThrow()
    })

    it('should throw on init if the preselected value is invalid', () => {
      expect(() => {
        setupComponent(ListboxWithInvalidPreselectedFormControl, [
          ReactiveFormsModule,
        ])
      }).toThrowError(
        'Listbox has selected values that do not match any of its options.',
      )
    })
  })
})

@Component({
  template: `
    <ck-listbox
      [tabindex]="listboxTabindex()"
      [value]="value()"
      [multiple]="multiple()"
      [disabled]="disabled()"
      (valueChange)="selectionChange($event)"
    >
      @for (option of options; track option) {
        <ck-option
          [value]="option"
          [disabled]="isSvetleDisabled() && option === 'svelte'"
        >
          {{ option.label }}
        </ck-option>
      }

      @if (molRender()) {
        <ck-option value="$mol">$mol</ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithOptions {
  public readonly value = signal<string[] | string>([])
  public readonly listboxTabindex = signal<number | null>(null)
  public readonly multiple = signal(false)
  public readonly disabled = signal(false)
  public readonly isSvetleDisabled = signal(false)
  public readonly molRender = signal(false)
  public readonly options = ['angular', 'react', 'vue', 'svelte', 'solid']
  public changedOption!: CkOption<string | undefined> | null

  public selectionChange(
    event: ListboxValueChangeEvent<string | undefined>,
  ): void {
    this.changedOption = event.option
  }
}

@Component({
  template: `
    <ck-listbox>
      @if (molRender()) {
        <ck-option value="$mol">$mol</ck-option>
      }

      @for (option of options; track option) {
        <ck-option [value]="option">
          {{ option.label }}
        </ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithMolOption {
  public readonly molRender = signal(false)
  public readonly options = ['angular', 'react', 'vue', 'svelte', 'solid']
}

@Component({
  template: `
    <ck-listbox
      [value]="value()"
      [multiple]="false"
      (valueChange)="selectionChange($event)"
    >
      <ck-option [value]="null">none</ck-option>
      @for (option of options; track option) {
        <ck-option [value]="option">
          {{ option }}
        </ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithNullOption {
  public readonly value = signal<Array<string | null>>([])
  public readonly options = ['angular', 'react', 'vue', 'svelte', 'solid']
  public eventValue!: Array<string | null>

  public selectionChange(event: ListboxValueChangeEvent<string>): void {
    this.eventValue = Array.from(event.value)
  }
}

@Component({
  template: `
    <ck-listbox />
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithNoOptions {}

@Component({
  template: `
    <ck-listbox [value]="value()" [multiple]="false">
      @for (option of options; track option) {
        <ck-option [value]="option">
          {{ option.label }}
        </ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithBoundValue {
  public readonly value = signal<string[]>(['react'])
  public readonly options = ['angular', 'react', 'vue', 'svelte', 'solid']
}

@Component({
  template: `
    <ck-listbox [value]="value()" [multiple]="true">
      @for (option of options; track option) {
        <ck-option [value]="option">
          {{ option.label }}
        </ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithMultipleBoundValues {
  public readonly value = signal<string[]>(['react', 'vue'])
  public readonly options = ['angular', 'react', 'vue', 'svelte']
}

@Component({
  template: `
    <ck-listbox [id]="id()">
      @for (option of options; track option) {
        <ck-option [value]="option">
          {{ option.label }}
        </ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithId {
  public readonly id = signal('')
  public readonly options = ['angular', 'react', 'vue', 'svelte', 'solid']
}

@Component({
  template: `
    <ck-listbox [formControl]="formControl" [multiple]="multiple()">
      @for (option of options; track option) {
        <ck-option [value]="option">
          {{ option.label }}
        </ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithFormControl {
  public formControl = new FormControl()
  public readonly multiple = signal(false)
  public readonly options = ['angular', 'react', 'vue', 'svelte', 'solid']
}

@Component({
  template: `
    <ck-listbox [formControl]="formControl">
      @for (option of options; track option) {
        <ck-option [value]="option">
          {{ option.label }}
        </ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithPreselectedFormControl {
  public readonly options = ['angular', 'react', 'vue', 'svelte', 'solid']
  public formControl = new FormControl('svelte')
}

@Component({
  template: `
    <ck-listbox [formControl]="formControl">
      @for (option of options; track option) {
        <ck-option [value]="option">
          {{ option.label }}
        </ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithInvalidPreselectedFormControl {
  public readonly options = ['angular', 'react', 'vue', 'svelte', 'solid']
  public formControl = new FormControl('$mol')
}

@Component({
  template: `
    <ck-listbox [compareWith]="compare">
      @for (option of options; track option) {
        <ck-option [value]="option">{{ option.name }}</ck-option>
      }
    </ck-listbox>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ListboxWithObjectValues {
  public readonly options = [
    { name: 'angular' },
    { name: 'react' },
    { name: 'vue' },
    { name: 'svelte' },
    { name: 'solid' },
  ]

  public readonly compare = (
    a: { name: string },
    b: { name: string },
  ): boolean => a.name === b.name
}
