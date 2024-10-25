import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog"
  import { BedDoubleIcon, CircleUserRoundIcon, BabyIcon, ChevronLeft, ChevronRight } from "lucide-react"
  import { useState, useEffect, useRef } from "react"
  import { useBookingStore } from "@/store/useBookingStore"
import { RoomType } from "@/types";
  
  interface LightboxModalProps {
    images: string[];
    roomType?: RoomType;
  }
  
  export function LightboxModal({ images, roomType }: LightboxModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const thumbnailsRef = useRef<HTMLDivElement>(null);
    const {
      lightboxModalState,
      setLightboxModalState
    } = useBookingStore();
  
    const handlePrevious = () => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
  
    const handleNext = () => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
  
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setLightboxModalState(false);
    };
  
    useEffect(() => {
      if (thumbnailsRef.current) {
        const thumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement;
        if (thumbnail) {
          const scrollLeft = thumbnail.offsetLeft - (thumbnailsRef.current.clientWidth / 2) + (thumbnail.clientWidth / 2);
          thumbnailsRef.current.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }, [currentIndex]);
  
    return (
      <Dialog
        open={lightboxModalState}
        onOpenChange={setLightboxModalState}
      >
        <DialogContent 
          className="w-11/12 max-w-6xl h-[90vh] bg-black/70 border-0 p-4 overflow-y-auto"
          onKeyDown={handleKeyDown}
        >
          <div className="flex flex-col min-h-full">
            {/* {roomType && (
              <div className="bg-white/20 p-4 rounded-lg flex-shrink-0">
                <p className="text-cstm-secondary font-bold text-2xl">{roomType.Name}</p>
                <div className="mt-4 flex items-start gap-4 transition flex-col sm:flex-row sm:justify-start sm:items-center">
                  <div className="flex gap-2 items-center text-cstm-primary">
                    <BedDoubleIcon size={16} />
                    <p>{roomType.BedTypes.TypeName}</p>
                  </div>
                  <div className="flex gap-2 items-center text-cstm-primary">
                    <CircleUserRoundIcon size={16} />
                    <p>{roomType.MaxAdult > 1 ? `${roomType.MaxAdult} Adults` : `${roomType.MaxAdult} Adult`}</p>
                  </div>
                  <div className="flex gap-2 items-center text-cstm-primary">
                    <BabyIcon size={16} />
                    <p>{roomType.MaxChild > 1 ? `${roomType.MaxChild} Children` : `${roomType.MaxChild} Child`}</p>
                  </div>
                </div>
              </div>
            )} */}
  
            {/* Fixed aspect ratio container */}
            <div className="relative w-full flex-grow flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                {
                  images.length > 1 && (
                    <button
                    onClick={handlePrevious}
                    className="absolute left-4 z-10 bg-white/20 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                    >
                    <ChevronLeft size={24} />
                    </button>
                  )
                }
  
                <div className="relative w-full h-full flex items-center justify-center px-12">
                  <div className="max-h-[60vh] max-w-full flex items-center justify-center">
                    <img
                      src={images[currentIndex]}
                      alt={`Image ${currentIndex + 1}`}
                      className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg"
                      style={{
                        maxHeight: '60vh',
                      }}
                    />
                  </div>
                </div>
                
                {
                  images.length > 1 && (
                    <button
                    onClick={handleNext}
                    className="absolute right-4 z-10 bg-white/20 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                    >
                    <ChevronRight size={24} />
                    </button>
                  )
                }
              </div>
            </div>
  
            <div className="flex flex-col gap-2 items-center flex-shrink-0">
                {roomType && (
                    <div className="flex flex-col items-center flex-shrink-0">
                        <p className="text-white text-xl font-bold">{roomType.Name}</p>
                        <div className="flex items-start gap-4 transition flex-col sm:flex-row sm:justify-start sm:items-center">
                            <div className="flex gap-2 items-center text-cstm-primary">
                                <BedDoubleIcon size={16} />
                                <p>{roomType.BedTypes.TypeName}</p>
                            </div>
                            <div className="flex gap-2 items-center text-cstm-primary">
                                <CircleUserRoundIcon size={16} />
                                <p>{roomType.MaxAdult > 1 ? `${roomType.MaxAdult} Adults` : `${roomType.MaxAdult} Adult`}</p>
                            </div>
                            <div className="flex gap-2 items-center text-cstm-primary">
                                <BabyIcon size={16} />
                                <p>{roomType.MaxChild > 1 ? `${roomType.MaxChild} Children` : `${roomType.MaxChild} Child`}</p>
                            </div>
                        </div>
                    </div>
                )}
              <p className="text-white/70">Image {currentIndex + 1} / {images.length}</p>
              
              <div 
                ref={thumbnailsRef}
                className="flex gap-4 overflow-x-auto max-w-full pb-2 px-4 scroll-smooth hide-scrollbar"
              >
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 items-center justify-center flex w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                      index === currentIndex 
                        ? 'brightness-100' 
                        : 'brightness-50 hover:brightness-75'
                    }`}
                  >
                    <div className="w-full h-full">
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }