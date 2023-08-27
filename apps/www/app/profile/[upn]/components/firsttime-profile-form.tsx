"use client"

import { get } from "http"
import { useContext, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CaretSortIcon, CheckIcon, LockClosedIcon } from "@radix-ui/react-icons"
import { CommandList } from "cmdk"
import { set } from "date-fns"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { LogToMongo } from "@/lib/trace"
import { getUserSession } from "@/lib/user"
import { cn } from "@/lib/utils"
import { IProgressProps, ProcessStatusOverlay } from "@/components/progress"
import { Button } from "@/registry/new-york/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/registry/new-york/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { toast } from "@/registry/new-york/ui/use-toast"
import { MagicboxContext } from "@/app/magicbox-context"
import { saveProfile } from "@/app/profile/actions/profiling"
import {
  Country,
  Me,
  NewsCategory,
  NewsChannel,
  Unit,
} from "@/app/profile/data/schemas"

import {
  getCountries,
  getNewsCategories,
  getNewsChannels,
  getUnits,
} from "../../data/sharepoint"
import { NewsChannels } from "./channel-picker"
import { https } from "@/lib/httphelper"

const profileFormSchema = z.object({
  country: z.string({ required_error: "Please select a country." }),
  unit: z.string({
    required_error: "Please select an unit to display.",
  }),
  channels: z.array(z.string({})).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

function match(channel: NewsChannel, unit: string, country: string): boolean {
  let found = false
  channel?.RelevantUnits?.forEach((relevantUnit) => {
    if (relevantUnit.LookupValue.toLowerCase() === unit) {
      found = true
    }
  })
  channel?.RelevantCountires?.forEach((relevantCountry) => {
    if (relevantCountry.LookupValue.toLowerCase() === country) {
      found = true
    }
  })

  return found
}

export function ProfileForm(props: {
  currentUnit: string
  currentCountry: string
}) {
  const magicbox = useContext(MagicboxContext)

  const [showCountries, setshowCountries] = useState(false)
  const [showUnits, setshowUnits] = useState(false)
  const [showChannels, setshowChannels] = useState(false)
  const [newsChannels, setNewsChannels] = useState<NewsChannel[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [newsCategories, setNewsCategories] = useState<NewsCategory[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [defaultChannels, setdefaultChannels] = useState<NewsChannel[]>([])
  const [processing, setProcessing] = useState(false)
  const [processPercentage, setProcessPercentage] = useState(0)
  const [processTitle, setProcessTitle] = useState("")
  const [processDescription, setProcessDescription] = useState("")
  const [lastResult, setlastResult] = useState<any>()
  
  const accessToken = magicbox.session?.accessToken ?? ""
  
  useEffect(() => {
    const load = async () => {
      setNewsChannels((await getNewsChannels(accessToken)) ?? [])
      setCountries((await getCountries(accessToken)) ?? [])
      setUnits((await getUnits(accessToken)) ?? [])
      setNewsCategories((await getNewsCategories(accessToken)) ?? [])
    }
    if (accessToken) load()
  }, [accessToken])

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    unit: props.currentUnit,
    country: props.currentCountry,
  }
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  async function onSubmit(data: ProfileFormValues) {
    setProcessTitle("Saving profile")
    setProcessDescription("Please wait while we save your profile.")
    setProcessPercentage(0)
    setProcessing(true)

   
    const meResponse = await https<Me>(
      magicbox.session?.accessToken ?? "",
      "GET",
      "https://graph.microsoft.com/v1.0/me"
    )
    if (meResponse.hasError) {
      toast({
        title: "Error:",
        variant: "destructive",
        description: meResponse.errorMessage,
      })
      return
    }
    const me = meResponse.data
    const membershipsToBe =
      data.channels
        ?.map((channel) => {
          const c = newsChannels.find(
            (i) => i.channelName.toLowerCase() === channel.toLowerCase()
          )
          return c?.GroupId ?? ""
        })
        .filter((i) => i !== "") ?? []

    // LogToMongo("logs-niels", "createGroups", { upn, membershipsToBe })

    const redirectto = await saveProfile(
      me?.id ?? "",
      data.country,
      data.unit,
      membershipsToBe,
      []
    )

    // toast({
    //   title: "You will be redirected to:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">
    //         {JSON.stringify(
    //           {
    //             redirectto,
    //           },
    //           null,
    //           2
    //         )}
    //       </code>
    //     </pre>
    //   ),
    // })
    setlastResult(redirectto)
    // await new Promise((r) => setTimeout(r, 1500))
    // setProcessPercentage(33)

    // await new Promise((r) => setTimeout(r, 1500))
    // setProcessPercentage(66)
    // await new Promise((r) => setTimeout(r, 1500))
    setProcessPercentage(100)
    setProcessDescription("Profile saved, you will be redirected.")
    await new Promise((r) => setTimeout(r, 1500))

    // setProcessing(false)
    window.open(redirectto.href, redirectto.target)
  }

  const watchUnit = form.watch("unit", "")
  const watchCountry = form.watch("country", "")

  useEffect(() => {
    form.setValue(
      "channels",
      getDefultChannels(props.currentCountry, props.currentUnit).map(
        (i) => i.channelName
      )
    )
  }, [newsChannels, props.currentUnit, props.currentCountry])

  useEffect(() => {
    form.setValue(
      "channels",
      getDefultChannels(watchCountry ,watchUnit).map(
        (i) => i.channelName
      )
    )
  }, [watchCountry, watchUnit])

  if (magicbox.session === null) {
    return <div>no access</div>
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="flex flex-col pb-[30px]">
                  <FormLabel>Business Unit / Group Function</FormLabel>
                  <Popover open={showUnits} onOpenChange={setshowUnits}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[400px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? units.find(
                                (unit) =>
                                  unit.unitName.toLowerCase() === field.value
                              )?.unitName
                            : "Select unit"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px]  p-0">
                      <Command>
                        <CommandInput placeholder="Search units..." />
                        <CommandList>
                          <CommandEmpty>No unit found.</CommandEmpty>
                          <CommandGroup heading="Business Units">
                            {units
                              .filter(
                                (unit) => unit.unitType === "Business Unit"
                              )
                              .sort((a, b) => a.sortOrder - b.sortOrder)
                              .map((unit) => (
                                <CommandItem
                                  value={unit.unitName}
                                  key={unit.unitName}
                                  onSelect={(value) => {
                                    form.setValue("unit", value)
                                    setshowUnits(false)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      unit.unitName === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {unit.unitName}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                          <CommandSeparator />
                          <CommandGroup heading="Group Functions">
                            {units
                              .filter(
                                (unit) => unit.unitType === "Group Function"
                              )
                              .sort((a, b) => a.sortOrder - b.sortOrder)
                              .map((unit) => (
                                <CommandItem
                                  value={unit.unitName}
                                  key={unit.unitName}
                                  onSelect={(value) => {
                                    form.setValue("unit", value)
                                    setshowUnits(false)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      unit.unitName === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {unit.unitName}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the unit which will be used for tailoring your
                    experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex flex-col pb-[30px]">
                  <FormLabel>Country / Region</FormLabel>
                  <Popover open={showCountries} onOpenChange={setshowCountries}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[400px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? countries.find(
                                (country) =>
                                  country.countryName.toLowerCase() ===
                                  field.value
                              )?.countryName
                            : "Select country"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0">
                      <Command>
                        <CommandInput placeholder="Search countries..." />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries
                              .sort((a, b) => a.sortOrder - b.sortOrder)
                              .map((country) => (
                                <CommandItem
                                  value={country.countryName}
                                  key={country.countryName}
                                  onSelect={(value) => {
                                    form.setValue("country", value)
                                    setshowCountries(false)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      country.countryName === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {country.countryName}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the country which will be used for tailoring your
                    experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channels"
              render={({ field }) => (
                <FormItem className="flex flex-col pb-[30px]">
                  <FormLabel>News Channels</FormLabel>
                  <Popover open={showChannels} onOpenChange={setshowChannels}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[400px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {/* <NewsChannels country={watchCountry} unit={watchUnit} channels={newsChannels} /> */}
                          {field.value
                            ? field.value.join(", ")
                            : "Select news channels"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0">
                      <Command>
                        <CommandInput placeholder="Search channels..." />

                        <CommandEmpty>No channels found.</CommandEmpty>
                        <CommandList>
                          {newsCategories
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((category, key) => {
                              return (
                                <CommandGroup
                                  key={key}
                                  heading={category.categoryName}
                                >
                                  {newsChannels
                                    .filter(
                                      (i) =>
                                        i.NewsCategoryId === category.categoryId
                                    )
                                    .sort((a, b) => {
                                      if (
                                        a.sortOrder.toLowerCase() <
                                        b.sortOrder.toLowerCase()
                                      ) {
                                        return -1
                                      }
                                      if (
                                        a.sortOrder.toLowerCase() >
                                        b.sortOrder.toLowerCase()
                                      ) {
                                        return 1
                                      }
                                      return 0
                                    })
                                    .map((channel) => (
                                      <CommandItem
                                        value={channel.channelName}
                                        key={channel.channelCode}
                                        onSelect={(value) => {
                                          if (channel.Mandatory) return
                                          
                                          let newvalue = []
                                          if (field.value?.includes(channel.channelName)) {
                                            newvalue = field.value?.filter(
                                              (i) => i !== channel.channelName
                                            )
                                          } else {
                                            newvalue = [
                                              ...(field.value ?? []),
                                              channel.channelName,
                                            ]
                                          }
                                          form.setValue("channels", newvalue)
                                        }}
                                      >
                                        {channel.Mandatory && (
                                          <LockClosedIcon
                                            className={"mr-2 h-4"}
                                          />
                                        )}
                                        {!channel.Mandatory && (
                                          <CheckIcon
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value?.includes(
                                                channel.channelName
                                              )
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        )}
                                        {channel.channelName}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              )
                            })}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the news channels that you subscribe to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Save profile</Button>
        </form>
      </Form>
      <ProcessStatusOverlay
        done={!processing}
        title={processTitle}
        description={processDescription}
        progress={processPercentage}
      />
      {/* <div>
        <pre>{JSON.stringify({ watchUnit, watchCountry,lastResult },null,2)}</pre>
      </div> */}
    </div>
  )

  function getDefultChannels(country: string, unit: string) {
    const defaults: NewsChannel[] = []
    newsChannels.forEach((channel) => {
      if (channel.Mandatory) {
        defaults.push(channel)
        return
      }

      if (match(channel, unit, country)) {
        defaults.push(channel)
        return
      }
    })
    return defaults
  }
}
