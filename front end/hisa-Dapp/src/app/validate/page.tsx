
'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { handleValidation, handleVerificationSubmit } from './actions';
import type { Tree } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Bot, Leaf, HeartPulse, ShieldAlert, AlertCircle, CheckCircle, Upload, ListTodo, MapPin, Ruler } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

const initialValidationState = {
  data: null,
  error: null,
  success: false,
};

const initialVerificationState = {
  error: null,
  success: false,
};

function SubmitButton({ text = 'Submit' }: { text?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Submitting...' : text}
    </Button>
  );
}

function VerificationForm({ tree, open, onOpenChange }: { tree: Tree, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [state, formAction] = useFormState(handleVerificationSubmit, initialVerificationState);
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (state.success) {
      toast({
        title: "Verification Submitted!",
        description: "Your validation has been recorded.",
        action: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      onOpenChange(false); // Close dialog on success
    }
  }, [state.success, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Validate Tree: {tree.species.commonName}</DialogTitle>
          <DialogDescription>Submit your verification data for tree ID: {tree.id}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
          <input type="hidden" name="treeId" value={tree.id} />
          
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Submission Failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="photos">Photos (up to 3)</Label>
            <Input id="photos" name="photos" type="file" accept="image/*" multiple required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" name="height" type="number" placeholder="e.g., 150" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="diameter">Diameter (cm)</Label>
              <Input id="diameter" name="diameter" type="number" step="0.1" placeholder="e.g., 5.5" required />
            </div>
          </div>

           <div className="space-y-2">
              <Label htmlFor="healthScore">Health Score: 8/10</Label>
              <Input id="healthScore" name="healthScore" type="range" min="1" max="10" defaultValue="8" />
            </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="e.g., Healthy growth, no visible pests." />
          </div>

          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <SubmitButton text="Submit Verification" />
        </form>
      </DialogContent>
    </Dialog>
  );
}


function ValidatorDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedTree, setSelectedTree] = React.useState<Tree | null>(null);

  // This assumes the user object has a `cfaId` property after login, which needs to be implemented.
  const cfaId = (user as any)?.cfaId || 'default-cfa'; // Fallback for now

  const pendingQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'trees'),
      where('planting.cfaId', '==', cfaId),
      where('validation.status', '==', 'pending')
    );
  }, [firestore, cfaId]);

  const { data: pendingTrees, isLoading } = useCollection<Tree>(pendingQuery);
  
  if (isLoading) return <div>Loading pending validations...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ListTodo /> Validator Dashboard
        </CardTitle>
        <CardDescription>
          Trees in your CFA that are awaiting verification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingTrees && pendingTrees.length > 0 ? (
          pendingTrees.map(tree => (
            <Card key={tree.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{tree.species.commonName}</p>
                <p className="text-sm text-muted-foreground">Planted on: {new Date(tree.planting.date.seconds * 1000).toLocaleDateString()}</p>
              </div>
              <Button onClick={() => setSelectedTree(tree)}>Validate</Button>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">No pending validations in your CFA.</p>
        )}
      </CardContent>
      {selectedTree && (
        <VerificationForm 
          tree={selectedTree} 
          open={!!selectedTree} 
          onOpenChange={(open) => !open && setSelectedTree(null)} 
        />
      )}
    </Card>
  );
}


export default function ValidatePage() {
  const { account } = useWallet();
  const { user } = useUser();
  const { toast } = useToast();
  const [state, formAction] = useFormState(handleValidation, initialValidationState);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (state.success) {
      toast({
        title: "Validation Successful!",
        description: "1 JANI token has been minted to your account.",
        action: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    }
     if (state.error) {
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: state.error,
      });
    }
  }, [state.success, state.error, toast]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };
  
  const isValidator = (user as any)?.role === 'validator';
  const defaultImage = PlaceHolderImages.find(p => p.id === 'tree-1');

  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Validation & Verification"
        description="Submit new trees for analysis or validate existing ones as a validator."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Submit New Tree for Analysis</CardTitle>
            <CardDescription>Upload a photo and provide details to analyze a new tree's health.</CardDescription>
          </CardHeader>
          <CardContent>
            {!account ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Wallet Not Connected</AlertTitle>
                <AlertDescription>
                  Please connect your wallet to submit a validation request.
                </AlertDescription>
              </Alert>
            ) : (
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="walletAccount" value={account} />
                <div className="space-y-2">
                  <Label htmlFor="photo">Tree Photo</Label>
                  <Input id="photo" name="photo" type="file" required onChange={handleFileChange} accept="image/*" />
                </div>
                
                <div className="w-full aspect-video rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                   <Image
                      src={photoPreview || defaultImage?.imageUrl || "https://picsum.photos/seed/tree1/800/600"}
                      alt="Tree preview"
                      width={800}
                      height={600}
                      className="object-cover h-full w-full"
                      data-ai-hint={defaultImage?.imageHint || 'tree'}
                    />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treeDescription">Tree Description</Label>
                  <Textarea id="treeDescription" name="treeDescription" placeholder="e.g., Young acacia tree in a sunny, dry environment. Leaves appear slightly yellow." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpsLocation">GPS location</Label>
                  <Input id="gpsLocation" name="gpsLocation" placeholder="e.g., 1.2921, 36.8219" required />
                </div>
                <SubmitButton text="Analyze and Mint Token" />
              </form>
            )}
          </CardContent>
        </Card>
        
        <div>
          {isValidator ? <ValidatorDashboard /> : (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Bot /> AI Analysis Result
                </CardTitle>
                <CardDescription>The AI's assessment of your tree will appear here.</CardDescription>
              </CardHeader>
              <CardContent>
                {state.error && !state.success && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}

                {!state.data && !state.error && (
                  <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center h-full">
                      <Leaf className="mx-auto h-12 w-12" />
                      <p className="mt-4">Submit tree data to see the health analysis.</p>
                  </div>
                )}
                
                {state.data && (
                  <div className="space-y-6">
                    <Alert>
                        <HeartPulse className="h-4 w-4" />
                        <AlertTitle>Overall Health Status</AlertTitle>
                        <AlertDescription>
                            <p className="font-bold text-lg text-foreground">{state.data.healthStatus}</p>
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2"><ShieldAlert /> Issues Identified</h3>
                        <p className="text-muted-foreground">{state.data.issuesIdentified}</p>
                      </div>
                      {state.data.affectedByNaturalPhenomena && (
                          <div>
                            <h3 className="font-semibold flex items-center gap-2"><AlertCircle /> Natural Phenomena</h3>
                            <p className="text-muted-foreground">{state.data.affectedByNaturalPhenomena}</p>
                          </div>
                      )}
                      <div>
                        <h3 className="font-semibold flex items-center gap-2"><Terminal /> Recommendations</h3>
                        <p className="text-muted-foreground">{state.data.recommendations}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
