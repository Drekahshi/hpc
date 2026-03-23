'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser } from '@/firebase';
import { registerTree } from '@/ai/flows/register-tree';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Leaf, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  commonName: z.string().min(1, 'Common name is required.'),
  scientificName: z.string().min(1, 'Scientific name is required.'),
  type: z.enum(['indigenous', 'exotic', 'medicinal']),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  altitude: z.coerce.number(),
  cfaId: z.string().min(1, 'CFA ID is required.'),
  nurserySource: z.string().min(1, 'Nursery source is required.'),
});

export default function PlantTreePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'indigenous',
      cfaId: (user as any)?.cfaId || 'default-cfa',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to register a tree.',
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const result = await registerTree({
        species: {
          commonName: values.commonName,
          scientificName: values.scientificName,
          type: values.type,
        },
        location: {
          lat: values.lat,
          lng: values.lng,
          altitude: values.altitude,
        },
        cfaId: values.cfaId,
        nurserySource: values.nurserySource,
        userId: user.uid,
      });

      if (result.success) {
        toast({
          title: 'Tree Registered!',
          description: `Tree ID: ${result.treeId} has been successfully created.`,
          action: <CheckCircle className="h-5 w-5 text-green-500" />,
        });
        router.push('/registry');
      } else {
        throw new Error(result.message || 'An unknown error occurred.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message,
      });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  if (!user) {
    return (
        <div className="flex flex-col gap-8">
            <AppHeader
                title="Plant a Tree"
                description="Register a new tree in the JANI ecosystem."
            />
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>You need to be logged in to access this feature.</AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Plant a Tree"
        description="Register a new tree in the JANI ecosystem."
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Tree Registration Form</CardTitle>
          <CardDescription>
            Fill in the details below to add a new tree to the registry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Species Details */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="commonName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Common Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Acacia" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="scientificName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Scientific Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Acacia abyssinica" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tree Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a tree type" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="indigenous">Indigenous</SelectItem>
                                    <SelectItem value="exotic">Exotic</SelectItem>
                                    <SelectItem value="medicinal">Medicinal</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     {/* Location Details */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="lat"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="-1.2921" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lng"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="36.8219" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="altitude"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Altitude (meters)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1800" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                 {/* Organization Details */}
                <div className="grid md:grid-cols-2 gap-8">
                     <FormField
                        control={form.control}
                        name="cfaId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Community Forest Association (CFA)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter CFA ID" {...field} />
                            </FormControl>
                             <FormDescription>
                                The ID of the CFA this tree belongs to.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="nurserySource"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nursery Source</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Nursery ID or name" {...field} />
                            </FormControl>
                             <FormDescription>
                                Where the seedling was sourced from.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering Tree...
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-4 w-4" />
                    Register Tree
                  </>
                )}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
