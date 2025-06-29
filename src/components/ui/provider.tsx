"use client"

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode";

const config = defineConfig({
    theme: {
        tokens: {
            fontSizes: {
                xs: { value: '1rem' },
                sm: { value: '1.4rem' },
                md: { value: '1.6rem' },
                lg: { value: '2rem' },
            },
        },
    },
});

const system = createSystem(defaultConfig, config);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
