
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRPaymentProps {
  amount: number;
  orderInfo: string;
}

const QRPayment = ({ amount, orderInfo }: QRPaymentProps) => {
  const [qrDataURL, setQrDataURL] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();


  const bankInfo = {
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountName: 'CONG TY TNHH ABC',
    amount: amount,
    content: `Thanh toan don hang ${orderInfo}`
  };

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Tạo nội dung QR theo chuẩn VietQR (đơn giản hóa)
        const qrContent = `Bank: ${bankInfo.bankName}
STK: ${bankInfo.accountNumber}
Ten: ${bankInfo.accountName}
So tien: ${amount.toLocaleString('vi-VN')} VND
Noi dung: ${bankInfo.content}`;

        const dataURL = await QRCode.toDataURL(qrContent, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrDataURL(dataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [amount, orderInfo]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({
        title: "Đã sao chép",
        description: "Thông tin đã được sao chép vào clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Thanh toán bằng QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex justify-center">
          {qrDataURL ? (
            <div className="p-4 bg-white rounded-lg shadow-sm border">
              <img src={qrDataURL} alt="QR Code thanh toán" className="w-64 h-64" />
            </div>
          ) : (
            <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Đang tạo QR Code...</p>
            </div>
          )}
        </div>

        {/* Thông tin chuyển khoản */}
        <div className="space-y-4">
          <h3 className="font-semibold text-center">Thông tin chuyển khoản</h3>
          
          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Ngân hàng:</span>
              <div className="flex items-center space-x-2">
                <span>{bankInfo.bankName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankInfo.bankName)}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Số tài khoản:</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono">{bankInfo.accountNumber}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankInfo.accountNumber)}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Chủ tài khoản:</span>
              <div className="flex items-center space-x-2">
                <span>{bankInfo.accountName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankInfo.accountName)}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <span className="font-medium">Số tiền:</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-orange-600">
                  {amount.toLocaleString('vi-VN')} VND
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(amount.toString())}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Nội dung:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{bankInfo.content}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankInfo.content)}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRPayment;
