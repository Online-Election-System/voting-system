"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type MemberInfo = {
  fullName: string
  nic: string
  dateOfBirth: Date | undefined
  gender: string
  civilStatus: string
  relationshipWithChief: string
  idCopy: File | null
  chiefApproval: string
}

type ChiefOccupant = {
  fullName: string
  nic: string
  dateOfBirth: Date | undefined
  gender: string
  civilStatus: string
  telephone: string
  idCopy: File | null
}

type HouseholdDetails = {
  electoralDistrict: string
  pollingDivision: string
  pollingDistrictNumber: string
  gramaNiladhariDivision: string
  villageStreetEstate: string
  houseNumber: string
  numberOfMembers: number
}

export default function HouseholdRegistrationForm() {
  const [currentStep, setCurrentStep] = useState<"chief" | "household" | "members">("chief")
  const [chiefOccupant, setChiefOccupant] = useState<ChiefOccupant>({
    fullName: "",
    nic: "",
    dateOfBirth: undefined,
    gender: "male",
    civilStatus: "single",
    telephone: "",
    idCopy: null,
  })

  const [householdDetails, setHouseholdDetails] = useState<HouseholdDetails>({
    electoralDistrict: "",
    pollingDivision: "",
    pollingDistrictNumber: "",
    gramaNiladhariDivision: "",
    villageStreetEstate: "",
    houseNumber: "",
    numberOfMembers: 1,
  })

  const [householdMembers, setHouseholdMembers] = useState<MemberInfo[]>([])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0)

  const handleChiefOccupantChange = (field: keyof ChiefOccupant, value: string | Date | undefined | File | null) => {
    setChiefOccupant({ ...chiefOccupant, [field]: value })
  }

  const handleHouseholdDetailsChange = (field: keyof HouseholdDetails, value: string | number) => {
    setHouseholdDetails({ ...householdDetails, [field]: value })
  }

  const handleMemberChange = (
    index: number,
    field: keyof MemberInfo,
    value: string | Date | undefined | File | null,
  ) => {
    const updatedMembers = [...householdMembers]
    if (!updatedMembers[index]) {
      updatedMembers[index] = {
        fullName: "",
        nic: "",
        dateOfBirth: undefined,
        gender: "male",
        civilStatus: "single",
        relationshipWithChief: "",
        idCopy: null,
        chiefApproval: "approved",
      }
    }
    updatedMembers[index] = { ...updatedMembers[index], [field]: value }
    setHouseholdMembers(updatedMembers)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isChief: boolean, memberIndex?: number) => {
    if (e.target.files && e.target.files[0]) {
      if (isChief) {
        handleChiefOccupantChange("idCopy", e.target.files[0])
      } else if (memberIndex !== undefined) {
        handleMemberChange(memberIndex, "idCopy", e.target.files[0])
      }
    }
  }

  const removeFile = (isChief: boolean, memberIndex?: number) => {
    if (isChief) {
      handleChiefOccupantChange("idCopy", null)
    } else if (memberIndex !== undefined) {
      handleMemberChange(memberIndex, "idCopy", null)
    }
  }

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!regex.test(pass)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      )
    } else {
      setPasswordError("")
    }
  }

  const initializeHouseholdMembers = () => {
    // Initialize the array with empty members based on the number specified
    const members = []
    for (let i = 0; i < householdDetails.numberOfMembers; i++) {
      members.push({
        fullName: "",
        nic: "",
        dateOfBirth: undefined,
        gender: "male",
        civilStatus: "single",
        relationshipWithChief: "",
        idCopy: null,
        chiefApproval: "approved",
      })
    }
    setHouseholdMembers(members)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted", { chiefOccupant, householdDetails, householdMembers })
  }

  const nextStep = () => {
    if (currentStep === "chief") {
      setCurrentStep("household")
    } else if (currentStep === "household") {
      initializeHouseholdMembers()
      setCurrentStep("members")
    }
  }

  const prevStep = () => {
    if (currentStep === "household") {
      setCurrentStep("chief")
    } else if (currentStep === "members") {
      setCurrentStep("household")
    }
  }

  const renderChiefOccupantForm = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Chief Occupant Registration</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chiefFullName">Full Name</Label>
          <Input
            id="chiefFullName"
            value={chiefOccupant.fullName}
            onChange={(e) => handleChiefOccupantChange("fullName", e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chiefNic">NIC Number</Label>
          <Input
            id="chiefNic"
            value={chiefOccupant.nic}
            onChange={(e) => handleChiefOccupantChange("nic", e.target.value)}
            placeholder="Enter NIC number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chiefTelephone">Telephone Number</Label>
          <Input
            id="chiefTelephone"
            value={chiefOccupant.telephone}
            onChange={(e) => handleChiefOccupantChange("telephone", e.target.value)}
            placeholder="Enter telephone number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !chiefOccupant.dateOfBirth && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {chiefOccupant.dateOfBirth ? format(chiefOccupant.dateOfBirth, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={chiefOccupant.dateOfBirth}
                onSelect={(date) => handleChiefOccupantChange("dateOfBirth", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={chiefOccupant.gender}
            onValueChange={(value) => handleChiefOccupantChange("gender", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="chiefMale" />
              <Label htmlFor="chiefMale">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="chiefFemale" />
              <Label htmlFor="chiefFemale">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Civil Status</Label>
          <Select
            value={chiefOccupant.civilStatus}
            onValueChange={(value) => handleChiefOccupantChange("civilStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select civil status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="chiefIdCopy">ID Copy</Label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              id="chiefIdCopy"
              type="file"
              className={cn("cursor-pointer", chiefOccupant.idCopy && "text-transparent")}
              onChange={(e) => handleFileChange(e, true)}
            />
            {chiefOccupant.idCopy && (
              <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                <span className="text-sm text-gray-500 truncate">{chiefOccupant.idCopy.name}</span>
              </div>
            )}
          </div>
          {chiefOccupant.idCopy && (
            <Button type="button" variant="outline" size="icon" onClick={() => removeFile(true)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Password Information</h3>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              validatePassword(e.target.value)
            }}
            placeholder="Enter password"
            required
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-500">Passwords do not match</p>
          )}
        </div>
      </div>
    </div>
  )

  const renderHouseholdDetailsForm = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Household Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="electoralDistrict">Electoral District</Label>
          <Input
            id="electoralDistrict"
            value={householdDetails.electoralDistrict}
            onChange={(e) => handleHouseholdDetailsChange("electoralDistrict", e.target.value)}
            placeholder="Enter electoral district"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pollingDivision">Polling Division</Label>
          <Input
            id="pollingDivision"
            value={householdDetails.pollingDivision}
            onChange={(e) => handleHouseholdDetailsChange("pollingDivision", e.target.value)}
            placeholder="Enter polling division"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pollingDistrictNumber">Polling District Number</Label>
          <Input
            id="pollingDistrictNumber"
            value={householdDetails.pollingDistrictNumber}
            onChange={(e) => handleHouseholdDetailsChange("pollingDistrictNumber", e.target.value)}
            placeholder="Enter polling district number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gramaNiladhariDivision">Grama Niladhari Division</Label>
          <Input
            id="gramaNiladhariDivision"
            value={householdDetails.gramaNiladhariDivision}
            onChange={(e) => handleHouseholdDetailsChange("gramaNiladhariDivision", e.target.value)}
            placeholder="Enter Grama Niladhari division"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="villageStreetEstate">Village/Street/Estate</Label>
          <Input
            id="villageStreetEstate"
            value={householdDetails.villageStreetEstate}
            onChange={(e) => handleHouseholdDetailsChange("villageStreetEstate", e.target.value)}
            placeholder="Enter village/street/estate"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="houseNumber">House Number</Label>
          <Input
            id="houseNumber"
            value={householdDetails.houseNumber}
            onChange={(e) => handleHouseholdDetailsChange("houseNumber", e.target.value)}
            placeholder="Enter house number"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numberOfMembers">Number of Household Members (excluding Chief Occupant)</Label>
        <Input
          id="numberOfMembers"
          type="number"
          min="0"
          value={householdDetails.numberOfMembers}
          onChange={(e) => handleHouseholdDetailsChange("numberOfMembers", Number.parseInt(e.target.value) || 0)}
          placeholder="Enter number of household members"
          required
        />
      </div>
    </div>
  )

  const renderMemberForm = (index: number) => (
    <div key={index} className="space-y-6 border p-4 rounded-md">
      <h3 className="text-lg font-semibold">Household Member {index + 1}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`fullName-${index}`}>Full Name</Label>
          <Input
            id={`fullName-${index}`}
            value={householdMembers[index]?.fullName || ""}
            onChange={(e) => handleMemberChange(index, "fullName", e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`nic-${index}`}>NIC Number</Label>
          <Input
            id={`nic-${index}`}
            value={householdMembers[index]?.nic || ""}
            onChange={(e) => handleMemberChange(index, "nic", e.target.value)}
            placeholder="Enter NIC number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !householdMembers[index]?.dateOfBirth && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {householdMembers[index]?.dateOfBirth ? (
                  format(householdMembers[index].dateOfBirth, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={householdMembers[index]?.dateOfBirth}
                onSelect={(date) => handleMemberChange(index, "dateOfBirth", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={householdMembers[index]?.gender || "male"}
            onValueChange={(value) => handleMemberChange(index, "gender", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id={`male-${index}`} />
              <Label htmlFor={`male-${index}`}>Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id={`female-${index}`} />
              <Label htmlFor={`female-${index}`}>Female</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Civil Status</Label>
          <Select
            value={householdMembers[index]?.civilStatus || "single"}
            onValueChange={(value) => handleMemberChange(index, "civilStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select civil status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`relationship-${index}`}>Relationship with Chief Occupant</Label>
          <Input
            id={`relationship-${index}`}
            value={householdMembers[index]?.relationshipWithChief || ""}
            onChange={(e) => handleMemberChange(index, "relationshipWithChief", e.target.value)}
            placeholder="E.g., Spouse, Child, Parent"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`idCopy-${index}`}>ID Copy</Label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              id={`idCopy-${index}`}
              type="file"
              className={cn("cursor-pointer", householdMembers[index]?.idCopy && "text-transparent")}
              onChange={(e) => handleFileChange(e, false, index)}
            />
            {householdMembers[index]?.idCopy && (
              <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                <span className="text-sm text-gray-500 truncate">{householdMembers[index].idCopy.name}</span>
              </div>
            )}
          </div>
          {householdMembers[index]?.idCopy && (
            <Button type="button" variant="outline" size="icon" onClick={() => removeFile(false, index)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Chief Occupant Approval</Label>
        <RadioGroup
          defaultValue="approved"
          onValueChange={(value) => handleMemberChange(index, "chiefApproval", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="approved" id={`approval-${index}`} />
            <Label htmlFor={`approval-${index}`}>I approve this member's registration</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-approved" id={`not-approval-${index}`} />
            <Label htmlFor={`not-approval-${index}`}>I do not approve this member's registration</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )

  const renderMembersForm = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Household Members Registration</h3>

      {householdDetails.numberOfMembers > 0 ? (
        <Tabs
          defaultValue="0"
          value={currentMemberIndex.toString()}
          onValueChange={(value) => setCurrentMemberIndex(Number.parseInt(value))}
        >
          <TabsList
            className="grid"
            style={{ gridTemplateColumns: `repeat(${Math.min(householdDetails.numberOfMembers, 5)}, 1fr)` }}
          >
            {Array.from({ length: householdDetails.numberOfMembers }).map((_, i) => (
              <TabsTrigger key={i} value={i.toString()}>
                Member {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {Array.from({ length: householdDetails.numberOfMembers }).map((_, i) => (
            <TabsContent key={i} value={i.toString()}>
              {renderMemberForm(i)}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center p-4 border rounded-md">
          <p>No additional household members to register.</p>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Please ensure all information is accurate and ID copies are clear and legible.
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-black mx-auto">Electoral Registration</CardTitle>
          <CardDescription className="mx-auto">Register your household for the election</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === "chief" && renderChiefOccupantForm()}
          {currentStep === "household" && renderHouseholdDetailsForm()}
          {currentStep === "members" && renderMembersForm()}
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep !== "chief" && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          {currentStep !== "members" ? (
            <Button type="button" className={currentStep === "chief" ? "ml-auto" : ""} onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Submit Registration
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}

