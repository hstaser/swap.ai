import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Upload,
  Link as LinkIcon,
  FileText,
  Sparkles,
  MessageCircle,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueue } from "@/hooks/use-queue";

interface ArticleUploadProps {
  onAnalyze?: (article: UploadedArticle) => void;
}

interface UploadedArticle {
  id: string;
  title: string;
  content: string;
  url?: string;
  uploadMethod: "file" | "url" | "text";
  timestamp: string;
}

export default function ArticleUpload({ onAnalyze }: ArticleUploadProps) {
  const { queue } = useQueue();
  const [uploadMethod, setUploadMethod] = useState<"file" | "url" | "text">("url");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<UploadedArticle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text.substring(0, 5000)); // Limit content length
        setTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!title || (!url && !content)) return;

    setIsAnalyzing(true);

    const article: UploadedArticle = {
      id: `upload_${Date.now()}`,
      title,
      content: content || `Article from ${url}`,
      url: url || undefined,
      uploadMethod,
      timestamp: new Date().toISOString(),
    };

    // Simulate analysis delay
    setTimeout(() => {
      setCurrentArticle(article);
      setIsAnalyzing(false);
      setShowSuccess(true);
      if (onAnalyze) {
        onAnalyze(article);
      }
    }, 2000);
  };

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setContent("");
    setShowSuccess(false);
    setCurrentArticle(null);
  };

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload Article for Analysis
            <Badge variant="outline" className="ml-auto text-xs">
              AI-Powered
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload news articles, reports, or analysis to understand their impact on your portfolio
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Upload Method Selector */}
          <div className="flex gap-2">
            <Button
              variant={uploadMethod === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setUploadMethod("url")}
              className="flex-1"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              URL
            </Button>
            <Button
              variant={uploadMethod === "file" ? "default" : "outline"}
              size="sm"
              onClick={() => setUploadMethod("file")}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              File
            </Button>
            <Button
              variant={uploadMethod === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setUploadMethod("text")}
              className="flex-1"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Text
            </Button>
          </div>

          {/* URL Input */}
          {uploadMethod === "url" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Article URL
                </label>
                <Input
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Article Title (Optional)
                </label>
                <Input
                  placeholder="Enter article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === "file" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
              {title && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    File Preview
                  </label>
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <strong>{title}</strong>
                    <p className="text-gray-600 mt-1 line-clamp-3">
                      {content.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Input */}
          {uploadMethod === "text" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Article Title
                </label>
                <Input
                  placeholder="Enter article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Article Content
                </label>
                <Textarea
                  placeholder="Paste article content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[120px]"
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length}/5000 characters
                </p>
              </div>
            </div>
          )}

          {/* Portfolio Context */}
          {queue.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Portfolio Context
                </span>
              </div>
              <p className="text-xs text-blue-700 mb-2">
                Analysis will consider impact on your {queue.length} queued stocks:
              </p>
              <div className="flex flex-wrap gap-1">
                {queue.slice(0, 5).map((stock) => (
                  <Badge key={stock.symbol} variant="secondary" className="text-xs">
                    {stock.symbol}
                  </Badge>
                ))}
                {queue.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{queue.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !title || (!url && !content)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Impact...
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Analyze Portfolio Impact
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Analysis Complete!
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Your article has been analyzed for portfolio impact
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {currentArticle && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-1">
                  {currentArticle.title}
                </h4>
                <p className="text-xs text-gray-600">
                  Uploaded via {currentArticle.uploadMethod}
                </p>
              </div>

              <div className="bg-blue-50 rounded p-3 text-sm border border-blue-200">
                <div className="font-medium text-blue-900 mb-1">
                  AI Analysis Results
                </div>
                <div className="text-blue-700">
                  Impact analysis has been generated and integrated with your market intelligence feed.
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Upload Another
                </Button>
                <Button
                  onClick={() => {
                    setShowSuccess(false);
                    resetForm();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  View Analysis
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
