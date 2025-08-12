import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Twitter,
  User,
  Plus,
  X,
  Settings,
  Search,
  CheckCircle,
  Globe,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PublicFigure {
  id: string;
  name: string;
  platform: "twitter" | "linkedin" | "reddit" | "news";
  handle?: string;
  category: "politics" | "business" | "tech" | "finance" | "celebrity" | "other";
  verified?: boolean;
  description?: string;
  isActive: boolean;
}

export interface NewsSource {
  id: string;
  name: string;
  type: "publication" | "website" | "blog" | "newsletter";
  url?: string;
  category: string;
  isActive: boolean;
}

// Default free sources that users start with
const DEFAULT_FREE_SOURCES: Omit<NewsSource, 'id' | 'isActive'>[] = [
  {
    name: "Reuters (Free)",
    type: "publication",
    url: "reuters.com",
    category: "News"
  },
  {
    name: "AP News",
    type: "publication",
    url: "apnews.com",
    category: "News"
  },
  {
    name: "Yahoo Finance",
    type: "publication",
    url: "finance.yahoo.com",
    category: "Finance"
  }
];

interface CustomNewsSourceManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSourcesUpdate?: (data: any) => void;
}

export function CustomNewsSourceManager({ isOpen, onClose, onSourcesUpdate }: CustomNewsSourceManagerProps) {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [activeTab, setActiveTab] = useState("figures");
  
  // Add figure states
  const [showAddFigure, setShowAddFigure] = useState(false);
  const [newFigureName, setNewFigureName] = useState("");
  const [newFigureHandle, setNewFigureHandle] = useState("");
  const [newFigurePlatform, setNewFigurePlatform] = useState<"twitter" | "linkedin" | "reddit" | "news">("twitter");
  
  // Add source states
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");

  // Load saved data or initialize with defaults
  useEffect(() => {
    const savedFigures = localStorage.getItem('customNewsFigures');
    const savedSources = localStorage.getItem('customNewsSources');
    
    if (savedFigures) {
      setFigures(JSON.parse(savedFigures));
    }
    
    if (savedSources) {
      setSources(JSON.parse(savedSources));
    } else {
      // Initialize with free sources
      const initialSources = DEFAULT_FREE_SOURCES.map(src => ({
        ...src,
        id: `src_${Date.now()}_${Math.random()}`,
        isActive: true
      }));
      setSources(initialSources);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('customNewsFigures', JSON.stringify(figures));
  }, [figures]);
  
  useEffect(() => {
    localStorage.setItem('customNewsSources', JSON.stringify(sources));
    if (onSourcesUpdate) {
      onSourcesUpdate({ figures, sources });
    }
  }, [sources, figures, onSourcesUpdate]);

  const handleAddFigure = () => {
    if (!newFigureName.trim()) return;
    
    const newFigure: PublicFigure = {
      id: `fig_${Date.now()}`,
      name: newFigureName,
      platform: newFigurePlatform,
      handle: newFigureHandle,
      category: "other",
      description: `Custom figure: ${newFigureName}`,
      isActive: true
    };
    
    setFigures(prev => [...prev, newFigure]);
    setNewFigureName("");
    setNewFigureHandle("");
    setShowAddFigure(false);
  };

  const handleAddSource = () => {
    if (!newSourceName.trim()) return;
    
    const newSource: NewsSource = {
      id: `src_${Date.now()}`,
      name: newSourceName,
      type: "publication",
      url: newSourceUrl,
      category: "Custom",
      isActive: true
    };
    
    setSources(prev => [...prev, newSource]);
    setNewSourceName("");
    setNewSourceUrl("");
    setShowAddSource(false);
  };

  const toggleFigureActive = (figureId: string) => {
    setFigures(prev => prev.map(fig => 
      fig.id === figureId ? { ...fig, isActive: !fig.isActive } : fig
    ));
  };

  const toggleSourceActive = (sourceId: string) => {
    setSources(prev => prev.map(src => 
      src.id === sourceId ? { ...src, isActive: !src.isActive } : src
    ));
  };

  const removeFigure = (figureId: string) => {
    setFigures(prev => prev.filter(fig => fig.id !== figureId));
  };

  const removeSource = (sourceId: string) => {
    setSources(prev => prev.filter(src => src.id !== sourceId));
  };

  const filteredFigures = figures.filter(fig => 
    fig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fig.handle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSources = sources.filter(src => 
    src.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Custom News Sources
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="figures">Public Figures</TabsTrigger>
              <TabsTrigger value="sources">News Sources</TabsTrigger>
            </TabsList>
            
            {/* Public Figures Tab */}
            <TabsContent value="figures" className="space-y-4 overflow-y-auto max-h-[55vh]">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search figures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => setShowAddFigure(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Figure
                </Button>
              </div>

              {figures.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Build Your Research Sources</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Add public figures like Elon Musk, politicians, or CEOs to track their updates
                  </p>
                  <Button 
                    onClick={() => setShowAddFigure(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add Your First Figure
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFigures.map(figure => (
                    <Card key={figure.id} className={cn(
                      "cursor-pointer transition-colors",
                      figure.isActive ? "border-green-200 bg-green-50/30" : "hover:border-gray-300"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3" onClick={() => toggleFigureActive(figure.id)}>
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                              {figure.platform === "twitter" ? (
                                <Twitter className="h-5 w-5 text-blue-600" />
                              ) : (
                                <User className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{figure.name}</h4>
                              {figure.handle && (
                                <p className="text-sm text-gray-600">{figure.handle}</p>
                              )}
                              <Badge variant="outline" className="text-xs mt-1">
                                {figure.platform}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={figure.isActive ? "default" : "outline"}>
                              {figure.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFigure(figure.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* News Sources Tab */}
            <TabsContent value="sources" className="space-y-4 overflow-y-auto max-h-[55vh]">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => setShowAddSource(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Source
                </Button>
              </div>
              
              <div className="space-y-3">
                {filteredSources.map(source => (
                  <Card key={source.id} className={cn(
                    "cursor-pointer transition-colors",
                    source.isActive ? "border-green-200 bg-green-50/30" : "hover:border-gray-300"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3" onClick={() => toggleSourceActive(source.id)}>
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                            <Globe className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{source.name}</h4>
                            {source.url && (
                              <p className="text-sm text-gray-600">{source.url}</p>
                            )}
                            <Badge variant="outline" className="text-xs mt-1">
                              {source.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={source.isActive ? "default" : "outline"}>
                            {source.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {!DEFAULT_FREE_SOURCES.some(def => def.name === source.name) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSource(source.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              {figures.filter(f => f.isActive).length} active figures • {sources.filter(s => s.isActive).length} active sources
            </div>
            <Button onClick={onClose}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Figure Modal */}
      <Dialog open={showAddFigure} onOpenChange={setShowAddFigure}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Public Figure</DialogTitle>
            <DialogDescription>
              Add a public figure to track their updates and news
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="e.g., Elon Musk, Warren Buffett"
                value={newFigureName}
                onChange={(e) => setNewFigureName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Platform Handle (Optional)</label>
              <Input
                placeholder="@username or account name"
                value={newFigureHandle}
                onChange={(e) => setNewFigureHandle(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Platform</label>
              <Select value={newFigurePlatform} onValueChange={(value: any) => setNewFigurePlatform(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="news">News Outlets</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddFigure(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddFigure}
                disabled={!newFigureName.trim()}
                className="flex-1"
              >
                Add Figure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Source Modal */}
      <Dialog open={showAddSource} onOpenChange={setShowAddSource}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add News Source</DialogTitle>
            <DialogDescription>
              Add a custom news source, publication, or newsletter
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Source Name</label>
              <Input
                placeholder="e.g., Bloomberg, TechCrunch, Substack Newsletter"
                value={newSourceName}
                onChange={(e) => setNewSourceName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Website URL (Optional)</label>
              <Input
                placeholder="https://example.com"
                value={newSourceUrl}
                onChange={(e) => setNewSourceUrl(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddSource(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSource}
                disabled={!newSourceName.trim()}
                className="flex-1"
              >
                Add Source
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
