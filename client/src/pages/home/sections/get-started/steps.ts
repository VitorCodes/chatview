type StepImagePosition =
  | 'top-left'
	| 'top-right'
  | 'top-center'
	| 'bottom-left'
  | 'bottom-right'
	| 'bottom-center'
	| 'center-right'

type StepImage = {
  url: string
  position: StepImagePosition;
	width?: string;
	height?: string;
	customStyle?: any;
}

type Step = {
  text: string
  images: StepImage[]
}

const messenger: Step[] = [
  {
    text: 'Open Facebook app and click on the Account button',
    images: [
			{
				url: require('../../../../assets/img/messenger/1.png').default,
				position: 'top-center',
				width: '90%'
			}
		],
  },
	{
    text: 'Under Settings & privacy, click on Settings',
    images: [
			{
				url: require('../../../../assets/img/messenger/2.png').default,
				position: 'top-center',
				width: '90%'
			}
		],
  },
	{
    text: 'Select Your Facebook Information option from the left side of the screen',
    images: [
			{
				url: require('../../../../assets/img/messenger/3.png').default,
				position: 'top-center',
				width: '60%'
			}
		],
  },
	{
    text: 'Look for the Download Your Information option and click on View',
    images: [
			{
				url: require('../../../../assets/img/messenger/4.png').default,
				position: 'top-center',
				width: '100%'
			}
		],
  },
	{
    text: 'Under Request a Download tab, choose JSON file format, select the image quality and date range (optional). Make sure you also select at least the Messages option in the options that appear bellow and then click Request Download',
    images: [
			{
				url: require('../../../../assets/img/messenger/5.png').default,
				position: 'top-left',
				width: '90%',
			},
			{
				url: require('../../../../assets/img/messenger/6.png').default,
				position: 'center-right',
				width: '90%',
				customStyle: {
					top: '50%',
					right: 0
				}
			}
		],
  },
	{
    text: 'After Facebook notifies that your information is available for download, select the Available Files tab and download your files. Finally, browse the files to your conversation, select the .JSON files and import them to Chatview',
    images: [
			{
				url: require('../../../../assets/img/messenger/7.png').default,
				position: 'top-center',
				width: '95%'
			},
			{
				url: require('../../../../assets/img/messenger/8.png').default,
				position: 'bottom-center',
				width: '60%'
			},
		],
  },
]

export default { messenger }
export type { StepImagePosition }
