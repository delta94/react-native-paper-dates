import * as React from 'react'
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  SafeAreaView,
} from 'react-native'
import {
  Appbar,
  Button,
  IconButton,
  overlay,
  Text,
  useTheme,
} from 'react-native-paper'
import { ModeType } from './Calendar'
import { LocalState } from './DatePickerModal'
import { useMemo } from 'react'
import Color from 'color'

export interface HeaderPickProps {
  label?: string
  saveLabel?: string
  headerSeparator?: string
  startLabel?: string
  endLabel?: string
}
export interface HeaderProps extends HeaderPickProps {
  state: LocalState
  mode: ModeType
  onDismiss: () => any
  onSave: () => any
  collapsed: boolean
  onToggle: () => any
}

export default function DatePickerModalHeader(props: HeaderProps) {
  const theme = useTheme()

  const { onToggle, collapsed, mode, saveLabel = 'Save' } = props

  const label = props.label
    ? props.label
    : props.mode === 'range'
    ? 'Select period'
    : 'Select date'

  const statusBarColor = useMemo<string>(
    () => Color(theme.colors.primary).darken(0.2).hex(),
    [theme]
  )

  const backgroundColor =
    theme.dark && theme.mode === 'adaptive'
      ? overlay(4, theme.colors.surface)
      : theme.colors.primary

  return (
    <>
      <StatusBar translucent={true} barStyle={'light-content'} />
      <View
        style={[
          {
            height: StatusBar.currentHeight,
            backgroundColor: statusBarColor,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.animated,
          {
            backgroundColor,
          },
        ]}
      >
        <SafeAreaView style={styles.safeContent}>
          <Appbar
            style={[
              styles.appbarHeader,
              { backgroundColor: backgroundColor.toString() },
            ]}
          >
            <Appbar.Action icon="close" onPress={props.onDismiss} />
            <Appbar.Content title={''} />
            <Button color={'#fff'} onPress={props.onSave}>
              {saveLabel}
            </Button>
          </Appbar>

          <View style={[styles.header]}>
            <View>
              <Text style={styles.label}>{label.toUpperCase()}</Text>

              <View style={styles.headerContentContainer}>
                {mode === 'range' ? <HeaderContentRange {...props} /> : null}
                {mode === 'single' ? <HeaderContentSingle {...props} /> : null}
              </View>
            </View>
            <View style={styles.fill} />
            <IconButton
              icon={collapsed ? 'pencil' : 'calendar'}
              color={'#fff'}
              onPress={onToggle}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  )
}

export function HeaderContentSingle({ state }: HeaderProps) {
  //D MMM

  const formatter = React.useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    })
  }, [])

  return (
    <Text style={styles.singleHeaderText}>{formatter.format(state.date)}</Text>
  )
}
export function HeaderContentRange({
  state,
  headerSeparator = '-',
  startLabel = 'Start',
  endLabel = 'End',
}: HeaderProps) {
  const formatter = React.useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    })
  }, [])

  return (
    <>
      <Text
        style={[
          styles.rangeHeaderText,
          state.startDate ? styles.headerTextFilled : styles.headerTextEmpty,
        ]}
      >
        {state.startDate ? formatter.format(state.startDate) : startLabel}
      </Text>
      <Text style={styles.headerSeparator}>{headerSeparator}</Text>
      <Text
        style={[
          styles.rangeHeaderText,
          state.endDate ? styles.headerTextFilled : styles.headerTextEmpty,
        ]}
      >
        {state.endDate ? formatter.format(state.endDate) : endLabel}
      </Text>
    </>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  animated: {
    paddingBottom: 0,
    elevation: 4,
  },
  safeContent: {
    paddingBottom: 0,
  },
  header: {
    height: 75,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 24,
    paddingRight: 12,
  },
  headerContentContainer: { marginTop: 5, flexDirection: 'row' },
  label: { color: '#fff', letterSpacing: 1, fontSize: 13 },
  singleHeaderText: { color: '#fff', fontSize: 25 },
  rangeHeaderText: { color: '#fff', fontSize: 25 },
  headerTextFilled: { color: 'rgba(255,255,255,1)' },
  headerTextEmpty: { color: 'rgba(255,255,255,0.5)' },
  headerSeparator: {
    color: 'rgba(255,255,255,1)',
    fontSize: 25,
    paddingLeft: 6,
    paddingRight: 6,
  },
  appbarHeader: {
    elevation: 0,
    // alignItems:'center'
  },
})
