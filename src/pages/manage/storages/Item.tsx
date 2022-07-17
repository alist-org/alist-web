import {
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectPlaceholder,
  SelectTrigger,
  SelectValue,
  Switch as HopeSwitch,
  Textarea,
} from "@hope-ui/solid";
import { For, Match, Switch } from "solid-js";
import { useT } from "~/hooks";
import { DriverItem, Type } from "~/types";

export type ItemProps = DriverItem &
  (
    | {
        type: Type.TypeBool;
        onChange?: (value: boolean) => void;
        value: boolean;
      }
    | {
        type: Type.TypeNumber;
        onChange?: (value: number) => void;
        value: number;
      }
    | {
        type: Type.TypeString | Type.TypeText | Type.TypeSelect;
        onChange?: (value: string) => void;
        value: string;
      }
  );

const Item = (props: ItemProps) => {
  const t = useT();
  return (
    <FormControl w="$full" display="flex" flexDirection="column">
      <FormLabel for={props.name} display="flex" alignItems="center">
        {t(`manage.settings.${props.name}`)}
      </FormLabel>
      <Switch fallback={<Center>{t("settings.unknown_type")}</Center>}>
        <Match when={props.type === Type.TypeString}>
          <Input
            id={props.name}
            value={props.value as string}
            onInput={
              props.type === Type.TypeString
                ? (e) => props.onChange?.(e.currentTarget.value)
                : undefined
            }
          />
        </Match>
        <Match when={props.type === Type.TypeNumber}>
          <Input
            type="number"
            id={props.name}
            value={props.value as number}
            onInput={
              props.type === Type.TypeNumber
                ? (e) => props.onChange?.(parseInt(e.currentTarget.value))
                : undefined
            }
          />
        </Match>
        <Match when={props.type === Type.TypeBool}>
          <HopeSwitch
            id={props.name}
            defaultChecked={props.value as boolean}
            onChange={
              props.type === Type.TypeBool
                ? (e: any) => props.onChange?.(e.currentTarget.checked)
                : undefined
            }
          />
        </Match>
        <Match when={props.type === Type.TypeText}>
          <Textarea
            id={props.name}
            value={props.value as string}
            onChange={
              props.type === Type.TypeText
                ? (e) => props.onChange?.(e.currentTarget.value)
                : undefined
            }
          />
        </Match>
        <Match when={props.type === Type.TypeSelect}>
          <Select
            id={props.name}
            defaultValue={props.value}
            onChange={
              props.type === Type.TypeSelect
                ? (e) => props.onChange?.(e)
                : undefined
            }
          >
            <SelectTrigger>
              <SelectPlaceholder>Choose a framework</SelectPlaceholder>
              <SelectValue />
              <SelectIcon />
            </SelectTrigger>
            <SelectContent>
              <SelectListbox>
                <For each={props.values?.split(",")}>
                  {(item) => (
                    <SelectOption value={item}>
                      <SelectOptionText>
                        {t(`manage.settings.${item}`)}
                      </SelectOptionText>
                      <SelectOptionIndicator />
                    </SelectOption>
                  )}
                </For>
              </SelectListbox>
            </SelectContent>
          </Select>
        </Match>
      </Switch>
      <FormHelperText>{props.help}</FormHelperText>
    </FormControl>
  );
};

export { Item };
