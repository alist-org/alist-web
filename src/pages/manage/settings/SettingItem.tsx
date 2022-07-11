import {
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
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
import { For, Match, Show, Switch } from "solid-js";
import { useT } from "~/hooks/useT";
import { Flag, SettingItem, Type } from "~/types/setting";
import { TiDelete } from "solid-icons/ti";

export type ItemProps = SettingItem & {
  onChange?: (value: string) => void;
  onDelete?: () => void;
  // value: () => string;
};

const Item = (props: ItemProps) => {
  const t = useT();
  return (
    <FormControl w="$full" display="flex" flexDirection="column">
      <FormLabel for={props.key} display="flex" alignItems="center">
        {t(`manage.settings.${props.key}`)}
        <Show when={props.flag === Flag.DEPRECATED}>
          <Icon
            ml="$2"
            as={TiDelete}
            boxSize="$5"
            color="$danger9"
            verticalAlign="middle"
            cursor="pointer"
            onClick={() => {
              props.onDelete?.();
            }}
          />
        </Show>
      </FormLabel>
      <Switch fallback={<Center>{t("manage.settings.unknown_type")}</Center>}>
        <Match when={[Type.TypeString, Type.TypeNumber].includes(props.type)}>
          <Input
            type={props.type === Type.TypeNumber ? "number" : ""}
            id={props.key}
            // value={props.value()}
            value={props.value}
            onInput={(e) => props.onChange?.(e.currentTarget.value)}
            readOnly={props.flag === Flag.READONLY}
          />
        </Match>
        <Match when={props.type === Type.TypeBool}>
          <HopeSwitch
            id={props.key}
            defaultChecked={props.value === "true"}
            // checked={props.value() === "true"}
            onChange={(e: any) =>
              // props.onChange?.(props.value() === "true" ? "false" : "true")
              props.onChange?.(e.currentTarget.checked ? "true" : "false")
            }
            readOnly={props.flag === Flag.READONLY}
          />
        </Match>
        <Match when={props.type === Type.TypeText}>
          <Textarea
            id={props.key}
            value={props.value}
            // value={props.value()}
            onChange={(e) => props.onChange?.(e.currentTarget.value)}
            readOnly={props.flag === Flag.READONLY}
          />
        </Match>
        <Match when={props.type === Type.TypeSelect}>
          <Select
            id={props.key}
            defaultValue={props.value}
            // value={props.value()}
            onChange={(e) => props.onChange?.(e)}
            readOnly={props.flag === Flag.READONLY}
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
